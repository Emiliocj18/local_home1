import { Observable } from 'rxjs';
import { MUsuarioSistema } from 'sigesp';

// Contrato del menú de sistemas del usuario autenticado (home).
export abstract class MenuService {
  abstract getMenu(): Observable<MUsuarioSistema[]>;
}
