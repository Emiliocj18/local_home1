import { Observable } from 'rxjs';
import { System } from '@core/models/system.model';

// Contrato del catalogo de empresas/sistemas del login.
export abstract class SystemService {
  abstract getSystems(): Observable<System[]>;
}
