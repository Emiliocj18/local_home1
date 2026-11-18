import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withXhr
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { UsuarioConectado } from '@core/models/usuario-conectado.model';
import { AuthService } from '@core/services/auth/auth.service';
import { RefreshResult } from '@core/models/refresh-result.model';
import { Subject } from 'rxjs';
import { type Mock } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { SessionStore } from './session.store';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let session: SessionStore;
  let refreshSubject: Subject<RefreshResult>;
  let authStub: { login: Mock; refresh: Mock; logout: Mock };

  const user: UsuarioConectado = {
    usuario: 'adminerp',
    empresa: 'SIGESP',
    nombre: 'Admin',
    apellido: 'ERP',
    tenantId: 1,
    tenantName: 'sigesp_empresa',
  };

  beforeEach(() => {
    refreshSubject = new Subject<RefreshResult>();
    authStub = {
      login: vi.fn(),
      refresh: vi.fn(),
      logout: vi.fn(),
    };
    authStub.refresh.mockReturnValue(refreshSubject.asObservable());

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authStub },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionStore);
    session.set('old-token', user);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('agrega Bearer y withCredentials a las peticiones', () => {
    http.get('/api/private').subscribe();

    const req = httpMock.expectOne('/api/private');
    expect(req.request.headers.get('Authorization')).toBe('Bearer old-token');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('ante 401 refresca una sola vez y reintenta todas las peticiones', () => {
    const responses: unknown[] = [];

    http.get('/api/a').subscribe((res) => responses.push(res));
    http.get('/api/b').subscribe((res) => responses.push(res));

    const reqA = httpMock.expectOne('/api/a');
    const reqB = httpMock.expectOne('/api/b');

    reqA.flush({}, { status: 401, statusText: 'Unauthorized' });
    reqB.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authStub.refresh).toHaveBeenCalledTimes(1);

    refreshSubject.next({ access_token: 'new-token', usuario: user });
    refreshSubject.complete();

    const retriedA = httpMock.expectOne('/api/a');
    const retriedB = httpMock.expectOne('/api/b');

    expect(retriedA.request.headers.get('Authorization')).toBe('Bearer new-token');
    expect(retriedB.request.headers.get('Authorization')).toBe('Bearer new-token');
    expect(session.token()).toBe('new-token');

    retriedA.flush({ ok: 'a' });
    retriedB.flush({ ok: 'b' });

    expect(responses.length).toBe(2);
  });

  it('si el refresh falla propaga el error a los suscriptores en espera', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    let firstError: unknown = null;
    let secondError: unknown = null;

    http.get('/api/a').subscribe({ error: (err) => (firstError = err) });
    http.get('/api/b').subscribe({ error: (err) => (secondError = err) });

    httpMock
      .expectOne('/api/a')
      .flush({}, { status: 401, statusText: 'Unauthorized' });
    httpMock
      .expectOne('/api/b')
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    refreshSubject.error(new Error('refresh failed'));

    expect(firstError).toBeTruthy();
    expect(secondError).toBeTruthy();
    expect(session.isAuthenticated()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
