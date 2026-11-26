import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { SessionStore } from './session.store';

const REFRESH_MARGIN_MS = 30_000;

// Programa el refresh proactivo 30s antes de que expire el access token.
@Injectable({ providedIn: 'root' })
export class SessionRefreshService {
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly auth: AuthService,
    private readonly session: SessionStore,
    private readonly router: Router,
  ) {}

  arm(accessToken: string): void {
    this.cancel();

    const exp = decodeExp(accessToken);
    if (!exp) {
      return;
    }

    const delay = exp * 1000 - Date.now() - REFRESH_MARGIN_MS;
    this.timer = setTimeout(() => this.refresh(), Math.max(delay, 1_000));
  }

  cancel(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private refresh(): void {
    this.auth.refresh().subscribe({
      next: (res) => {
        this.session.set(res.access_token, res.usuario);
        this.arm(res.access_token);
      },
      error: () => {
        this.cancel();
        this.session.clear();
        this.router.navigate(['/auth/login']);
      },
    });
  }
}

// Decodifica el `exp` del JWT soportando base64url (sin padding).
function decodeExp(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );
    const decoded = JSON.parse(atob(padded)) as { exp?: unknown };

    return typeof decoded.exp === 'number' ? decoded.exp : null;
  } catch {
    return null;
  }
}
