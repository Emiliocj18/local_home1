export interface UsuarioConectado {
  usuario: string;
  empresa: string;
  nombre: string;
  apellido: string;
  tenantId: number;
  tenantName: string;
  idUsuario?: number;
  idEmpresa?: number;
  idPersonal?: number;
}
