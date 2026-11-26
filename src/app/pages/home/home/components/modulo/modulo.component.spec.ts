import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { vi } from 'vitest';
import { ModuleManagerService } from '@core/services/module-manager.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { ModuloComponent } from './modulo.component';

describe('ModuloComponent', () => {
  let fixture: ComponentFixture<ModuloComponent>;
  let component: ModuloComponent;
  const manager = { addTab: vi.fn() };
  const toast = { show: vi.fn(), error: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ModuloComponent],
      providers: [
        { provide: ModuleManagerService, useValue: manager },
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloComponent);
    component = fixture.componentInstance;
    component.codigo = 'SSS';
    component.nombre = 'Seguridad';
    component.icono = 'security';
  });

  it('H-T02 con url null muestra mantenimiento y no llama addTab', () => {
    component.url = null;
    component.href = null;

    component.abrirModulo();

    expect(toast.show).toHaveBeenCalledWith(
      'Lo sentimos, el módulo se encuentra en mantenimiento.',
      'info',
    );
    expect(manager.addTab).not.toHaveBeenCalled();
  });

  it('H-T03 con url string delega la apertura en addTab', () => {
    component.url = 'http://localhost:4201';
    component.href = 'http://localhost:4201';
    manager.addTab.mockReturnValue('opened');

    component.abrirModulo();

    expect(manager.addTab).toHaveBeenCalledWith({
      name: 'SSS',
      url: 'http://localhost:4201',
      href: 'http://localhost:4201',
    });
    expect(toast.show).not.toHaveBeenCalled();
  });

  it('avisa cuando el popup se bloquea', () => {
    component.url = 'http://localhost:4201';
    manager.addTab.mockReturnValue('blocked');

    component.abrirModulo();

    expect(toast.error).toHaveBeenCalled();
  });

  it('H-T09 el badge de mantenimiento solo aparece con url null', () => {
    component.url = null;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[data-testid="badge-mantenimiento"]'),
    ).not.toBeNull();

    component.url = 'http://localhost:4201';
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[data-testid="badge-mantenimiento"]'),
    ).toBeNull();
  });
});
