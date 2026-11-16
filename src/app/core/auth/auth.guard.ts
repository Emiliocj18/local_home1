import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from './session.store';

// Protege rutas privadas: sin sesion redirige al login.
export const authGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  return session.isAuthenticated()
    ? true
    : router.createUrlTree(['/auth/login']);
};

// Evita que un usuario autenticado vuelva a la pantalla de login.
export const sessionGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  return session.isAuthenticated() ? router.createUrlTree(['/home']) : true;
};
