import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, TimeoutError, catchError, map, throwError, timeout } from 'rxjs';
import { MUsuarioSistema, IUsuarioSistema } from '@emiliocj18/sigesp-core';
import { API_URL } from '@core/config/api.config';
import { MenuService } from './menu.service';

const REQUEST_TIMEOUT_MS = 10000;

@Injectable()
export class HttpMenuService extends MenuService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {
    super();
  }

  getMenu(): Observable<MUsuarioSistema[]> {
    return this.http
      .get<IUsuarioSistema[]>(`${this.apiUrl}/queries/sss/sistemas`, {
        withCredentials: true,
      })
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        map((items) => items.map((item) => new MUsuarioSistema(item))),
        catchError((error: unknown) =>
          throwError(() => new Error(this.errorMessage(error))),
        ),
      );
  }

  private errorMessage(error: unknown): string {
    if (error instanceof TimeoutError) {
      return 'Tiempo de espera agotado al cargar los módulos.';
    }

    const httpError = error as HttpErrorResponse;
    if (!httpError || httpError.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }

    const message = httpError.error?.message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }

    return 'No se pudieron cargar los módulos.';
  }
}
