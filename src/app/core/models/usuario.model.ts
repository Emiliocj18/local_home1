import { UsuarioLogin } from '../interfaces/interfaces';
import { MConfiguracionDB } from './configuracion-db.model';

export class MUsuario{

  public nombre: string = null;
  public empresa: {
    id: number,
    titulo: string,
    periodoFiscal: string} = {
      id: null,
      titulo: null,
      periodoFiscal: null
    };
  public conexionDB: MConfiguracionDB = null;
  public token: string = null;
  public carpeta: string = null;
  public id: number = 0;
  public foto: string=null;

  constructor(usuario: UsuarioLogin, db:MConfiguracionDB){
    this.nombre = usuario.l_usuario;
    this.empresa.periodoFiscal = usuario.perfiscal;
    this.empresa.id = parseInt(usuario.id_empresa);
    this.id = parseInt(usuario.id_usuario);
    this.foto = usuario.foto;
    this.empresa.titulo = usuario.titemp;
    this.conexionDB = db;
    this.carpeta= usuario.carpeta;
    this.token = usuario.token;
  }

}
