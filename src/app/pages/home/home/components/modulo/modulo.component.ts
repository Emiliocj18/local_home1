import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ModuleManagerService } from '@core/services/module-manager.service';
import { ToastService } from '@shared/components/toast/toast.service';

const MANTENIMIENTO = 'Lo sentimos, el módulo se encuentra en mantenimiento.';
const POPUP_BLOQUEADO =
  'No se pudo abrir el módulo. Habilite las ventanas emergentes del navegador.';

@Component({
  selector: 'modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ModuloComponent {
  @Input() public codigo: string = '';
  @Input() public nombre: string = '';
  @Input() public icono: string = '';
  @Input() public url: string | null = null;
  @Input() public href: string | null = null;

  constructor(
    private readonly moduleManager: ModuleManagerService,
    private readonly toast: ToastService,
  ) {}

  public get mantenimiento(): boolean {
    return this.url === null;
  }

  // La tarjeta no conoce window.open: solo delega y traduce el resultado.
  public abrirModulo(): void {
    if (this.url === null) {
      this.toast.show(MANTENIMIENTO, 'info');
      return;
    }

    const result = this.moduleManager.addTab({
      name: this.codigo,
      url: this.url,
      href: this.href ?? this.url,
    });

    if (result === 'blocked') {
      this.toast.error(POPUP_BLOQUEADO);
    }
  }
}
