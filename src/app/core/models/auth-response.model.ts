import { UsuarioConectado } from './usuario-conectado.model';

export interface AuthResponse {
  access_token: string;
  usuario: UsuarioConectado;
}
