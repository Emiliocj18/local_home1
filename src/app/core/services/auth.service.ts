import { Injectable } from '@angular/core';

// ============================================================================
// TODO-MIGRACION (§7.7) - AuthService LEGACY (PHP) SELLADO
// ----------------------------------------------------------------------------
// Esta clase ya NO se usa en ningun flujo activo. Todos sus metodos dependian
// del backend PHP (environment.url) y fueron comentados. Se conservan como
// referencia. Esta clase debe ELIMINARSE cuando la nueva modalidad NestJS
// cubra estos casos:
//
//   | Metodo           | Que hacia (legacy)                                | Reemplazo en la nueva modalidad (NestJS)          |
//   |------------------|---------------------------------------------------|---------------------------------------------------|
//   | cryptoPassword   | Cifrado AES-256-CBC determinista de la clave en   | NO se necesita: la clave viaja plana por HTTPS y  |
//   |                  | el cliente (algoritmo legacy SIGESP).             | el backend hace hash/verificacion (bcrypt).       |
//   | obtenerConfigDB  | GET config_bd.php: catalogo de BD CON             | GET /connections/catalogo (ya existe, sin         |
//   |                  | credenciales de BD expuestas al cliente.          | credenciales).                                    |
//   | logIn            | POST login_dao.php con clave cifrada y            | POST /login/connect (ya existe).                  |
//   |                  | credenciales de BD desde el cliente.              |                                                   |
//   | signUp           | POST sign_up.php: registro de cuentas.            | Endpoint Nest de registro (§7.6, por crear).      |
//   | getUserById      | GET usuario_dao.php: detalle de perfil.           | Endpoints Nest de perfil (§7.3, por crear).       |
//   | updateUser       | PUT usuario_dao.php: actualizar perfil/foto.      | Endpoints Nest de perfil (§7.3, por crear).       |
//   | UserNoAuthorized | PUT usuario_dao.php?noAuth=true: auditoria de     | Auditoria NO_AUTORIZADO en el backend (§7.5).     |
//   |                  | intentos fallidos.                                |                                                   |
// ============================================================================

// TODO-MIGRACION (§7.7): imports usados solo por los metodos legacy comentados.
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
// import { Observable } from 'rxjs';
// import { MConfiguracionDB } from '../models/configuracion-db.model';
// import { map, retry } from 'rxjs/operators';
// import { MUsuario, MUserDetail } from 'sigesp';
// import { IResponse } from 'sigesp/lib/core/interfaces/Response';
// import { LocalService } from './sigesp.service';
// import { UntypedFormGroup } from '@angular/forms';
// import * as CryptoJS from 'crypto-js';
// import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO-MIGRACION (§7.7): estado legacy. El usuario ahora vive en SessionStore.
  // public usuario: MUsuario = null;

  // TODO-MIGRACION (§7.7): constructor legacy (HttpClient + LocalService).
  // constructor(
  //   private http: HttpClient,
  //   private sigesp: LocalService
  // ) { }

  // TODO-MIGRACION (§7.7): cifraba la clave con AES-256-CBC en el cliente.
  // En la nueva modalidad la clave viaja plana por HTTPS y el backend la
  // verifica (bcrypt) o migra el hash legacy. NO reimplementar en el cliente.
  //
  // public cryptoPassword(password : string){
  //   // Substances
  //   var data = "Data";
  //   var salt = CryptoJS.SHA256( "SIGESP" );
  //   var iv   = CryptoJS.SHA1( "V3" );
  //   var key  = CryptoJS.SHA256( password );
  //
  //   // Prepare substances
  //   salt = salt.toString( CryptoJS.enc.Base64 );
  //   iv   = iv.toString( CryptoJS.enc.Base64 ).substr( 0, 16 );
  //   iv   = CryptoJS.enc.Utf8.parse( iv );
  //   key  = key.toString( CryptoJS.enc.Base64 ).substr( 0, 32 );
  //   key  = CryptoJS.enc.Utf8.parse( key );
  //
  //   // Cipher
  //   var encrypted = CryptoJS.AES.encrypt( salt + data, key, { iv: iv });
  //
  //   return encrypted.toString();
  // }

  // TODO-MIGRACION (§7.7): GET config_bd.php exponia credenciales de BD al
  // cliente. Reemplazo: GET /connections/catalogo (SystemService).
  //
  // public obtenerConfigDB(): Observable<MConfiguracionDB[]>{
  //   return this.http.get(`${environment.url}/main/config_bd.php`).pipe(
  //     retry(3),
  //     map((res: any) => res.map(element => new MConfiguracionDB(element)))
  //   )
  // }

  // TODO-MIGRACION (§7.7): login contra login_dao.php (PHP).
  // Reemplazo: POST /login/connect (HttpAuthService).
  //
  // public logIn(userData): Observable<MUsuario>{
  //
  //   const password = this.cryptoPassword( userData.clave );
  //
  //   let data = {
  //     conexion_postgres:{
  //       basededatos: userData.selectdb.obtenerDB(),
  //       gestor: userData.selectdb.obtenerGestor(),
  //       login: userData.selectdb.obtenerDBLogin(),
  //       nombre: userData.selectdb.nombre,
  //       password: userData.selectdb.obtenerDBPassword(),
  //       puerto: userData.selectdb.obtenerPuerto(),
  //       servidor: userData.selectdb.obtenerServidor()
  //     },
  //     fl_clave: password,
  //     carpeta: `${environment.carpeta}`,
  //     fl_usuario: userData.usuario,
  //     operacionl: "iniciarsesion"
  //   }
  //   return this.http.post(`${environment.url}/dao/login/login_dao.php`,
  //   JSON.stringify(data))
  //   .pipe(
  //     retry(3),
  //     map((res: any) => {
  //       if (res.success) {
  //
  //         res.data = new MUsuario({
  //           conexionDB: {
  //             baseDeDatos: res.data.basededatos,
  //             baseDeDatosHR: userData.selectdb.obtenerDBHR(),
  //             baseDeDatosMig: userData.selectdb.obtenerDBMigration(),
  //             gestor: res.data,
  //             login: res.data.login,
  //             nombre: res.data.nombre,
  //             servidor: res.data.servidor,
  //             password: res.data.password,
  //             puerto: res.data.puerto,
  //
  //           },
  //           empresa: {
  //             id: res.data.id_empresa,
  //             periodoFiscal: res.data.perfiscal,
  //             finPeriodoFiscal:(res.data.perfiscal).substring(0,4)+'-12-31',
  //             titulo: res.data.titemp,
  //           },
  //           foto: res.data.foto,
  //           id_usuario: res.data.id_usuario,
  //           nombre: `${res.data.nombre}`,
  //           apellido: `${res.data.apellido}`,
  //           carpeta: `${environment.carpeta}`,
  //           token: res.data.token,
  //           sistema:res.data.sistema,
  //           id_enterprise:res.data.id_enterprise,
  //         });
  //       } else {
  //         res.data = null;
  //       }
  //       return res;
  //     })
  //   )
  // }

  // TODO-MIGRACION (§7.6): registro contra sign_up.php (PHP).
  // Reemplazo: endpoint Nest de registro (por crear).
  //
  // public signUp(userData): Observable<any>{
  //
  //   const password = this.cryptoPassword( userData.password );
  //
  //   let data = {
  //     connection:{
  //       basededatos: userData.selectdb.obtenerDB(),
  //       login: userData.selectdb.obtenerDBLogin(),
  //       password: userData.selectdb.obtenerDBPassword(),
  //       puerto: userData.selectdb.obtenerPuerto(),
  //       servidor: userData.selectdb.obtenerServidor()
  //     },
  //     username: userData.username,
  //     identification: userData.id,
  //     name: userData.name,
  //     lastname: userData.lastname,
  //     password: password,
  //   }
  //   return this.http.post(`${environment.url}/dao/sss/sign_up.php`,
  //   JSON.stringify(data))
  //
  // }

  // TODO-MIGRACION (§7.3): perfil contra usuario_dao.php (PHP).
  // Reemplazo: endpoints Nest de perfil (por crear).
  //
  // public getUserById(id: number): Observable<IResponse> {
  //   return this.http.get<IResponse>(`${environment.url}/dao/sss/usuario_dao.php?id=${id}`,
  //   { headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `${this.sigesp.usuario.token}`
  //   } }).pipe(
  //     retry(3),
  //     map((res: any) => {
  //       if (res.success) {
  //         res.data = new MUserDetail(res.data);
  //       }
  //       return res;
  //     })
  //   );
  // }

  // TODO-MIGRACION (§7.3): actualizacion de perfil/foto contra usuario_dao.php.
  // Reemplazo: endpoints Nest de perfil (por crear).
  //
  // public updateUser(form: UntypedFormGroup, user: MUserDetail, base64: string = null){
  //
  //   user.birthday =moment(form.get('nac').value).format('YYYY-MM-DD');
  //   const body = {
  //     userData: {
  //       apeusu: form.get('ape').value,
  //       nomusu: form.get('nom').value,
  //       telusu: form.get('tel').value,
  //       emausu: form.get('ema').value,
  //       fecnac: user.birthday,
  //       fotusu: user.photo
  //     },
  //     base64: base64
  //   }
  //
  //   return this.http.put<IResponse>(
  //     `${environment.url}/dao/sss/usuario_dao.php?&home=true`,
  //     body,
  //     { headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `${this.sigesp.usuario.token}`
  //     } }
  //   ).pipe(
  //     map(res => {
  //       if (res.success) {
  //         res.data = new MUserDetail(res.data);
  //       }
  //       return res;
  //     })
  //   )
  //
  // }

  // TODO-MIGRACION (§7.5): auditoria de intentos fallidos contra usuario_dao.php.
  // Reemplazo: auditoria NO_AUTORIZADO en el backend.
  //
  // public UserNoAuthorized(userData, token: string) {
  //   const password = this.cryptoPassword(userData.clave);
  //   let data2 = {
  //     conexion_postgres: {
  //       basededatos: userData.selectdb.obtenerDB(),
  //       nombre: userData.selectdb.nombre,
  //       servidor: userData.selectdb.obtenerServidor()
  //     },
  //     fl_clave: password,
  //     carpeta: `${environment.carpeta}`,
  //     fl_usuario: userData.usuario,
  //     operacionl: "iniciarsesion"
  //   };
  //   return this.http.put(`${environment.url}/dao/sss/usuario_dao.php?noAuth=true`,
  //     data2, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `${token}`
  //       }
  //     }
  //   ).pipe(
  //     map((res: any) => {
  //       if (res.data) {
  //         this.sigesp.cerrarSesion()
  //       }
  //       return res;
  //     })
  //   );
  // }

}
