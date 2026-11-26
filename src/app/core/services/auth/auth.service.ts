import { Observable } from 'rxjs';
import { AuthResult } from '@core/models/auth-result.model';
import { LoginPayload } from '@core/models/login-payload.model';
import { RefreshResult } from '@core/models/refresh-result.model';

// Contrato de autenticacion. La implementacion concreta se enlaza por DI.
export abstract class AuthService {
  abstract login(payload: LoginPayload): Observable<AuthResult>;
  abstract refresh(): Observable<RefreshResult>;
  abstract logout(): Observable<{ message: string }>;
}
