import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ModuleManagerService } from './module-manager.service';

interface FakeWindow {
  closed: boolean;
  focus: ReturnType<typeof vi.fn>;
  opener: unknown;
  location: { href: string };
}

function fakeWindow(closed = false): FakeWindow {
  return {
    closed,
    focus: vi.fn(),
    opener: {},
    location: { href: '' },
  };
}

describe('ModuleManagerService', () => {
  let service: ModuleManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleManagerService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('H-T04 abre, registra la pestaña y normaliza el href', () => {
    const win = fakeWindow();
    const open = vi.spyOn(window, 'open').mockReturnValue(win as unknown as Window);

    const result = service.addTab({
      name: 'SSS',
      url: 'http://localhost:4201',
      href: 'http://localhost:4201/',
    });

    expect(result).toBe('opened');
    expect(open).toHaveBeenCalledWith('http://localhost:4201', '_blank');
    expect(win.opener).toBeNull();

    service.closeAll();
    expect(win.location.href).toBe('http://localhost:4201/auth/close');
  });

  it('H-T05 con la pestaña abierta devuelve focused y no duplica', () => {
    const win = fakeWindow();
    const open = vi.spyOn(window, 'open').mockReturnValue(win as unknown as Window);
    service.addTab({ name: 'SSS', url: 'http://localhost:4201', href: 'http://localhost:4201' });

    const result = service.addTab({
      name: 'SSS',
      url: 'http://localhost:4201',
      href: 'http://localhost:4201',
    });

    expect(result).toBe('focused');
    expect(win.focus).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledTimes(1);
  });

  it('H-T06 con popup bloqueado devuelve blocked y no registra', () => {
    vi.spyOn(window, 'open').mockReturnValue(null);

    const result = service.addTab({
      name: 'SSS',
      url: 'http://localhost:4201',
      href: 'http://localhost:4201',
    });

    expect(result).toBe('blocked');
    expect((service as unknown as { tabs: unknown[] }).tabs.length).toBe(0);
  });

  it('H-T07 closeAll navega la pestaña registrada a /auth/close', () => {
    const win = fakeWindow();
    vi.spyOn(window, 'open').mockReturnValue(win as unknown as Window);
    service.addTab({ name: 'SSS', url: 'http://localhost:4201', href: 'http://localhost:4201' });

    service.closeAll();

    expect(win.location.href).toBe('http://localhost:4201/auth/close');
    expect((service as unknown as { tabs: unknown[] }).tabs.length).toBe(0);
  });

  it('H-T08 closeAll tolera una pestaña cerrada', () => {
    const win = fakeWindow(true);
    vi.spyOn(window, 'open').mockReturnValue(win as unknown as Window);
    service.addTab({ name: 'SSS', url: 'http://localhost:4201', href: 'http://localhost:4201' });

    expect(() => service.closeAll()).not.toThrow();
    expect(win.location.href).toBe('');
  });

  it('H-T08 closeAll tolera una pestaña sin href', () => {
    const win = fakeWindow();
    vi.spyOn(window, 'open').mockReturnValue(win as unknown as Window);
    service.addTab({ name: 'SSS', url: 'http://localhost:4201', href: '' });

    expect(() => service.closeAll()).not.toThrow();
    expect(win.location.href).toBe('');
  });
});
