import { computed, Injectable, signal } from '@angular/core';
import { UsuarioConectado } from '@core/models/usuario-conectado.model';

// Estado de sesion en memoria. Nunca se persiste en localStorage/sessionStorage.
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<UsuarioConectado | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  set(token: string, user: UsuarioConectado): void {
    this._token.set(token);
    this._user.set(user);
  }

  setToken(token: string): void {
    this._token.set(token);
  }

  setUser(user: UsuarioConectado): void {
    this._user.set(user);
  }

  clear(): void {
    this._token.set(null);
    this._user.set(null);
  }
}
