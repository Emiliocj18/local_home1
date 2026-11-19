import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ModuloComponent {
  @Input() public nombre: string = null;
  @Input() public icono: string = null;
  @Input() public ruta: string = null;

  // TODO(SSO): reactivar cuando existan los modulos destino.
  // Requiere GET /auth/session + POST /auth/handoff/exchange en Nest.
  // NO volver a enviar btoa(JSON.stringify(usuario)) por la URL.
  public abrirModulo(): void {
    if (!environment.ssoEnabled) {
      return;
    }
    // Flujo nuevo: pedir un codigo de un solo uso y abrir el modulo con ?code=.
  }

}
