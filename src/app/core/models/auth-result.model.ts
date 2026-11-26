import { UsuarioConectado } from './usuario-conectado.model';

export interface AuthResult {
  success: boolean;
  token?: string;
  message?: string;
  usuario?: UsuarioConectado;
}
