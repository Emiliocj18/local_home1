import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth/auth.service';
import { SessionStore } from './session.store';

// Evita reintentar indefinidamente una peticion que ya se reintento tras refrescar.
const RETRIED_AFTER_REFRESH = new HttpContextToken<boolean>(() => false);

// Single-flight: una sola renovacion en curso compartida por todas las peticiones en espera.
let refreshInFlight$: Observable<string> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionStore);
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = session.token();
  const authReq = req.clone({
    withCredentials: true,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const isUnauthorized =
        error instanceof HttpErrorResponse && error.status === 401;
      const isRefreshCall = req.url.includes('/auth/refresh');
      const alreadyRetried = req.context.get(RETRIED_AFTER_REFRESH);

      if (
        !isUnauthorized ||
        isRefreshCall ||
        alreadyRetried ||
        !session.isAuthenticated()
      ) {
        return throwError(() => error);
      }

      return refreshTokenOnce(auth, session, router).pipe(
        switchMap((newToken) =>
          next(
            req.clone({
              withCredentials: true,
              context: req.context.set(RETRIED_AFTER_REFRESH, true),
              setHeaders: { Authorization: `Bearer ${newToken}` },
            }),
          ),
        ),
      );
    }),
  );
};

function refreshTokenOnce(
  auth: AuthService,
  session: SessionStore,
  router: Router,
): Observable<string> {
  if (refreshInFlight$) {
    return refreshInFlight$;
  }

  refreshInFlight$ = auth.refresh().pipe(
    map((res) => {
      session.set(res.access_token, res.usuario);
      return res.access_token;
    }),
    catchError((error: unknown) => {
      session.clear();
      router.navigate(['/auth/login']);
      // Propaga el fallo a TODOS los suscriptores en espera (no los deja colgados).
      return throwError(() => error);
    }),
    finalize(() => {
      refreshInFlight$ = null;
    }),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  return refreshInFlight$;
}
