import { UsuarioConectado } from './usuario-conectado.model';

export interface RefreshResult {
  access_token: string;
  usuario: UsuarioConectado;
}
