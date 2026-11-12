import { ConfiguracionDB } from '../interfaces/interfaces';

export class MConfiguracionDB{
  public nombre: string = null;
  private gestor: string = null;
  private baseDeDatos: string = null;
  private dbRecursosHumanos: string = null;
  private dbMigracion: string = null;
  private login: string = null;
  private password: string = null;
  private puerto: string = null;
  private servidor: string = null;

  constructor(db: ConfiguracionDB){
    this.baseDeDatos = db.basededatos;
    this.dbMigracion = db.basededatosmigracion;
    this.dbRecursosHumanos = db.basededatosrrhh;
    this.gestor = db.gestor;
    this.login = db.login;
    this.nombre = db.nombre;
    this.password = db.password;
    this.puerto = db.puerto;
    this.servidor = db.servidor
  }

  public obtenerGestor(): string{
    return this.gestor;
  }

  public obtenerDB(): string{
    return this.baseDeDatos;
  }

  public obtenerDBHR(): string{
    return this.dbRecursosHumanos;
  }

  public obtenerDBMigration(): string{
    return this.dbMigracion;
  }

  public obtenerDBLogin(): string{
    return this.login;
  }

  public obtenerDBPassword(): string{
    return this.password;
  }

  public obtenerPuerto(): string{
    return this.puerto;
  }

  public obtenerServidor(): string{
    return this.servidor;
  }

}
