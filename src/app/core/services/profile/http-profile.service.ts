import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, TimeoutError, catchError, throwError, timeout } from 'rxjs';
import { API_URL } from '@core/config/api.config';
import { Perfil, UpdatePerfilPayload } from '@core/models/perfil.model';
import { ProfileService } from './profile.service';

const REQUEST_TIMEOUT_MS = 10000;

@Injectable()
export class HttpProfileService extends ProfileService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {
    super();
  }

  getProfile(): Observable<Perfil> {
    return this.http
      .get<Perfil>(`${this.apiUrl}/queries/sss/perfil`, { withCredentials: true })
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError((error: unknown) =>
          throwError(() => new Error(this.errorMessage(error))),
        ),
      );
  }

  updateProfile(payload: UpdatePerfilPayload): Observable<Perfil> {
    return this.http
      .put<Perfil>(`${this.apiUrl}/queries/sss/perfil`, payload, {
        withCredentials: true,
      })
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError((error: unknown) =>
          throwError(() => new Error(this.errorMessage(error))),
        ),
      );
  }

  private errorMessage(error: unknown): string {
    if (error instanceof TimeoutError) {
      return 'Tiempo de espera agotado al cargar el perfil.';
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

    return 'No se pudo cargar el perfil.';
  }
}
