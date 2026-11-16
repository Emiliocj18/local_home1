import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, TimeoutError, catchError, map, of, timeout } from 'rxjs';
import { API_URL } from '@core/config/api.config';
import { AuthResponse } from '@core/models/auth-response.model';
import { AuthResult } from '@core/models/auth-result.model';
import { LoginPayload } from '@core/models/login-payload.model';
import { RefreshResult } from '@core/models/refresh-result.model';
import { AuthService } from './auth.service';

const REQUEST_TIMEOUT_MS = 10000;

@Injectable()
export class HttpAuthService extends AuthService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {
    super();
  }

  login(payload: LoginPayload): Observable<AuthResult> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login/connect`, payload, {
        withCredentials: true,
      })
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        map((res) => ({
          success: true,
          token: res.access_token,
          usuario: res.usuario,
        })),
        catchError((error: unknown) =>
          of({ success: false, message: this.errorMessage(error) }),
        ),
      );
  }

  refresh(): Observable<RefreshResult> {
    return this.http.post<RefreshResult>(
      `${this.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true },
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/auth/logout`,
      {},
      { withCredentials: true },
    );
  }

  private errorMessage(error: unknown): string {
    if (error instanceof TimeoutError) {
      return 'Tiempo de espera agotado. Intente nuevamente.';
    }

    const httpError = error as HttpErrorResponse;
    if (!httpError || httpError.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }

    const message = httpError.error?.message;
    if (Array.isArray(message)) {
      return message.filter((m) => typeof m === 'string').join('; ');
    }
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }

    return 'No se pudo iniciar sesion.';
  }
}
