import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { API_URL } from '@core/config/api.config';
import { ModuloSistema } from '@core/models/modulo-sistema.model';
import { HttpMenuService } from './http-menu.service';

describe('HttpMenuService', () => {
  let service: HttpMenuService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpMenuService,
        { provide: API_URL, useValue: 'http://localhost:3000' },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(HttpMenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('H-T01 mapea la respuesta a ModuloSistema[] con codigo/nombre/icono/url', () => {
    let result: ModuloSistema[] | undefined;

    service.getMenu().subscribe((items) => (result = items));

    const req = httpMock.expectOne('http://localhost:3000/queries/sss/sistemas');
    expect(req.request.withCredentials).toBe(true);
    req.flush([
      {
        id_empresa: 1,
        id_usuario: 10,
        codsis: 'SSS',
        nomsis: 'Seguridad',
        estsis: '1',
        imgsis: 'security',
        accsis: 'seguridad',
        tipsis: 1,
        url: 'http://localhost:4201',
      },
      {
        id_empresa: 1,
        id_usuario: 10,
        codsis: 'SCB',
        nomsis: 'Banco',
        estsis: '1',
        imgsis: 'bank',
        accsis: 'banco',
        tipsis: 2,
        url: null,
      },
    ]);

    expect(result).toBeDefined();
    expect(result?.length).toBe(2);
    expect(result?.[0]).toEqual(
      new ModuloSistema({
        id_empresa: '1',
        id_usuario: '10',
        codsis: 'SSS',
        nomsis: 'Seguridad',
        estsis: '1',
        imgsis: 'security',
        accsis: 'seguridad',
        tipsis: '1',
        url: 'http://localhost:4201',
      }),
    );
    expect(result?.[1].habilitado).toBe(false);
  });
});
