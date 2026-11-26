import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthService } from '@core/services/auth/auth.service';
import { SessionRefreshService } from './session-refresh.service';
import { SessionStore } from './session.store';

// Rehidrata la sesion al arrancar usando la cookie HttpOnly de refresh.
@Injectable({ providedIn: 'root' })
export class SessionBootstrapService {
  private initialized = false;

  constructor(
    private readonly auth: AuthService,
    private readonly session: SessionStore,
    private readonly refresh: SessionRefreshService,
  ) {}

  bootstrap(): Observable<boolean> {
    if (this.initialized) {
      return of(true);
    }
    this.initialized = true;

    return this.auth.refresh().pipe(
      tap((res) => {
        this.session.set(res.access_token, res.usuario);
        this.refresh.arm(res.access_token);
      }),
      map(() => true),
      // Sin cookie valida el usuario simplemente ve el login.
      catchError(() => of(false)),
    );
  }
}
