import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, TimeoutError, catchError, map, shareReplay, throwError, timeout } from 'rxjs';
import { API_URL } from '@core/config/api.config';
import { ConnectionCatalogItem, System } from '@core/models/system.model';
import { SystemService } from './system.service';

const REQUEST_TIMEOUT_MS = 10000;

@Injectable()
export class HttpSystemService extends SystemService {
  private cache$: Observable<System[]> | null = null;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {
    super();
  }

  getSystems(): Observable<System[]> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<ConnectionCatalogItem[]>(`${this.apiUrl}/connections/catalogo`, {
          withCredentials: true,
        })
        .pipe(
          timeout(REQUEST_TIMEOUT_MS),
          map((items) =>
            items.map((item) => ({
              id: String(item.connectionId),
              name: item.name,
            })),
          ),
          catchError((error: unknown) => {
            // Permite reintentar el catalogo si la peticion fallo.
            this.cache$ = null;
            return throwError(() => new Error(this.errorMessage(error)));
          }),
          shareReplay(1),
        );
    }
    return this.cache$;
  }

  private errorMessage(error: unknown): string {
    if (error instanceof TimeoutError) {
      return 'Tiempo de espera agotado al cargar las empresas.';
    }

    const httpError = error as HttpErrorResponse;
    if (!httpError || httpError.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }

    const message = httpError.error?.message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }

    return 'No se pudo cargar el catalogo de empresas.';
  }
}
