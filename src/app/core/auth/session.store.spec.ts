import { TestBed } from '@angular/core/testing';
import { UsuarioConectado } from '@core/models/usuario-conectado.model';
import { SessionStore } from './session.store';

describe('SessionStore', () => {
  let store: SessionStore;

  const user: UsuarioConectado = {
    usuario: 'adminerp',
    empresa: 'SIGESP',
    nombre: 'Admin',
    apellido: 'ERP',
    tenantId: 1,
    tenantName: 'sigesp_empresa',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(SessionStore);
  });

  it('arranca sin sesion', () => {
    expect(store.isAuthenticated()).toBe(false);
    expect(store.token()).toBeNull();
    expect(store.user()).toBeNull();
  });

  it('guarda token y usuario en memoria', () => {
    store.set('access-token', user);

    expect(store.isAuthenticated()).toBe(true);
    expect(store.token()).toBe('access-token');
    expect(store.user()).toEqual(user);
  });

  it('actualiza solo el token tras un refresh', () => {
    store.set('old-token', user);
    store.setToken('new-token');

    expect(store.token()).toBe('new-token');
    expect(store.user()).toEqual(user);
  });

  it('limpia la sesion', () => {
    store.set('access-token', user);
    store.clear();

    expect(store.isAuthenticated()).toBe(false);
    expect(store.token()).toBeNull();
    expect(store.user()).toBeNull();
  });
});
