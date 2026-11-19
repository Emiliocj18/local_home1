import { Observable } from 'rxjs';
import { Perfil, UpdatePerfilPayload } from '@core/models/perfil.model';

// Contrato del perfil. La implementacion concreta se enlaza por DI.
export abstract class ProfileService {
  abstract getProfile(): Observable<Perfil>;
  abstract updateProfile(payload: UpdatePerfilPayload): Observable<Perfil>;
}
