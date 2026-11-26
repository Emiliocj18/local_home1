import { Observable } from 'rxjs';
import { ModuloSistema } from '@core/models/modulo-sistema.model';

// Contrato del menú de sistemas del usuario autenticado (home).
export abstract class MenuService {
  abstract getMenu(): Observable<ModuloSistema[]>;
}
