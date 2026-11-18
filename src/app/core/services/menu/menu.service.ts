import { Observable } from 'rxjs';
import { MUsuarioSistema } from '@emiliocj18/sigesp-core';

// Contrato del menú de sistemas del usuario autenticado (home).
export abstract class MenuService {
  abstract getMenu(): Observable<MUsuarioSistema[]>;
}
