import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MConfiguracionDB } from '../models/configuracion-db.model';
import { map, retry } from 'rxjs/operators';
import { MUsuario, MUserDetail } from 'sigesp';
import { IResponse } from 'sigesp/lib/core/interfaces/Response';
import { LocalService } from './sigesp.service';
import { UntypedFormGroup } from '@angular/forms';
import * as CryptoJS from 'crypto-js'; 
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public usuario: MUsuario = null;
  constructor(
    private http: HttpClient,
    private sigesp: LocalService
  ) { }


   /**
   * @name CryptoPassword
   * @description Metodo que encrypta el password basada en la libreria CryptoJs
   * @author Ing. Wilmer Briceño
   */

    public cryptoPassword(password : string){
      // Substances
      var data = "Data";
      var salt = CryptoJS.SHA256( "SIGESP" );
      var iv   = CryptoJS.SHA1( "V3" );
      var key  = CryptoJS.SHA256( password );    
      
      // Prepare substances
      salt = salt.toString( CryptoJS.enc.Base64 );
      iv   = iv.toString( CryptoJS.enc.Base64 ).substr( 0, 16 );
      iv   = CryptoJS.enc.Utf8.parse( iv );
      key  = key.toString( CryptoJS.enc.Base64 ).substr( 0, 32 );
      key  = CryptoJS.enc.Utf8.parse( key );
  
      // Cipher
      var encrypted = CryptoJS.AES.encrypt( salt + data, key, { iv: iv });

      return encrypted.toString();
    }

  public obtenerConfigDB(): Observable<MConfiguracionDB[]>{
    return this.http.get(`${environment.url}/main/config_bd.php`).pipe(
      retry(3),
      map((res: any) => res.map(element => new MConfiguracionDB(element)))
    )
  }

  public logIn(userData): Observable<MUsuario>{
    
    const password = this.cryptoPassword( userData.clave );

    let data = {
      conexion_postgres:{
        basededatos: userData.selectdb.obtenerDB(),
        gestor: userData.selectdb.obtenerGestor(),
        login: userData.selectdb.obtenerDBLogin(),
        nombre: userData.selectdb.nombre,
        password: userData.selectdb.obtenerDBPassword(),
        puerto: userData.selectdb.obtenerPuerto(),
        servidor: userData.selectdb.obtenerServidor()
      },
      fl_clave: password,
      carpeta: `${environment.carpeta}`,
      fl_usuario: userData.usuario,
      operacionl: "iniciarsesion"
    }
    return this.http.post(`${environment.url}/dao/login/login_dao.php`,
    JSON.stringify(data))
    .pipe(
      retry(3),
      map((res: any) => { 
        if (res.success) {
         
          res.data = new MUsuario({
            conexionDB: {            
              baseDeDatos: res.data.basededatos,
              baseDeDatosHR: userData.selectdb.obtenerDBHR(),
              baseDeDatosMig: userData.selectdb.obtenerDBMigration(), 
              gestor: res.data,
              login: res.data.login,
              nombre: res.data.nombre,
              servidor: res.data.servidor,
              password: res.data.password,
              puerto: res.data.puerto,
             
            },
            empresa: {
              id: res.data.id_empresa,             
              periodoFiscal: res.data.perfiscal,
              finPeriodoFiscal:(res.data.perfiscal).substring(0,4)+'-12-31',
              titulo: res.data.titemp,             
            },
            foto: res.data.foto,
            id_usuario: res.data.id_usuario,
            nombre: `${res.data.nombre}`,
            apellido: `${res.data.apellido}`,
            carpeta: `${environment.carpeta}`,
            token: res.data.token,
            sistema:res.data.sistema,
            id_enterprise:res.data.id_enterprise,
          });
        } else {
          res.data = null;
        }
        return res;
      })
    )
  }
  
  public signUp(userData): Observable<any>{
    
    const password = this.cryptoPassword( userData.password );

    let data = {
      connection:{
        basededatos: userData.selectdb.obtenerDB(),
        login: userData.selectdb.obtenerDBLogin(),
        password: userData.selectdb.obtenerDBPassword(),
        puerto: userData.selectdb.obtenerPuerto(),
        servidor: userData.selectdb.obtenerServidor()
      },
      username: userData.username, 
      identification: userData.id, 
      name: userData.name, 
      lastname: userData.lastname, 
      password: password,
    }
    return this.http.post(`${environment.url}/dao/sss/sign_up.php`,
    JSON.stringify(data))

  }

  /**
   * @description Obtiene un Usuario segun su ID
   * @return Observable<IResponse>
   * @author Carlos Albornoz
   */
  public getUserById(id: number): Observable<IResponse> {
    return this.http.get<IResponse>(`${environment.url}/dao/sss/usuario_dao.php?id=${id}`, 
    { headers: {
      'Content-Type': 'application/json',
      'Authorization': `${this.sigesp.usuario.token}`
    } }).pipe(
      retry(3),
      map((res: any) => {
        if (res.success) {
          res.data = new MUserDetail(res.data);
        }
        return res;
      })
    );
  }

  public updateUser(form: UntypedFormGroup, user: MUserDetail, base64: string = null){

    user.birthday =moment(form.get('nac').value).format('YYYY-MM-DD');
    const body = {
      userData: {
        apeusu: form.get('ape').value,
        nomusu: form.get('nom').value,
        telusu: form.get('tel').value,
        emausu: form.get('ema').value,
        fecnac: user.birthday,
        fotusu: user.photo
      }, 
      base64: base64
    }

    return this.http.put<IResponse>(
      `${environment.url}/dao/sss/usuario_dao.php?&home=true`,
      body,
      { headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.sigesp.usuario.token}`
      } }
    ).pipe(
      map(res => {
        if (res.success) {
          res.data = new MUserDetail(res.data);
        }
        return res;
      })
    )

  }

  public UserNoAuthorized(userData, token: string) {
    const password = this.cryptoPassword(userData.clave);
    let data2 = {
      conexion_postgres: {
        basededatos: userData.selectdb.obtenerDB(),
        nombre: userData.selectdb.nombre,
        servidor: userData.selectdb.obtenerServidor()
      },
      fl_clave: password,
      carpeta: `${environment.carpeta}`,
      fl_usuario: userData.usuario,
      operacionl: "iniciarsesion"
    };
    return this.http.put(`${environment.url}/dao/sss/usuario_dao.php?noAuth=true`,
      data2, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        }
      }
    ).pipe(
      map((res: any) => {
        if (res.data) {
          this.sigesp.cerrarSesion()
        }
        return res;
      })
    )
  }

}
