import { Injectable, OnInit } from '@angular/core';
import { IResponse, MUsuario, MUsuarioSistema, SigespService } from 'sigesp';//'@core/models/usuario.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(private http: HttpClient, private sigesp: SigespService) {}

  public usuario: MUsuario = null;
  public carpeta = environment.carpeta;
  

  public guardarUsuario(user: MUsuario){
    user.carpeta=this.carpeta;    
    this.usuario = user;
    let cypher = btoa(JSON.stringify(this.usuario))
    sessionStorage.setItem("user", cypher);
    console.log('guardado en sessionStorage');
  }

  public sesionActiva(): boolean{
    if (!this.usuario) {
      if (!sessionStorage.getItem("user")) {
        return false
      } else {
        //esa linea de getItem(user) creo que captura la session storage del usuario activo... 
        //y alli es donde creo que se debe agregar la variable carpeta al token..
        let activeUser:MUsuario = JSON.parse(atob(sessionStorage.getItem("user")));
        this.guardarUsuario(activeUser);
      }
    }
    return true;
  }


  public getPerfilSistema(id_usuario:number,token:any,URL:any ){

    return this.http.get(`${URL}/dao/sss/sistemas_dao.php?usuario=${id_usuario}`,
  {headers: {
    "Authorization": token,
     "Content-Type": "application/json"
  }})
    .pipe(     
      map((res: any) => { 
        if(res.data.length>0){
          res.data = res.data.map(e => new MUsuarioSistema(e));  
        }
        return res;     
       })
      
    );

  } 

  public cerrarSesion() {
    this.usuario = null;
    sessionStorage.removeItem('user');
    sessionStorage.clear();
  }

  // public getPerfilSistema(id_usuario:number,token:any,URL:any ){
  //   return this.http.get(`${URL}/dao/sss/sistemas_dao.php?usuario=${id_usuario}`,
  // {headers: {
  //   "Authorization": token,
  //    "Content-Type": "application/json"
  // }})
  //   .pipe(     
  //     map((res: any) => { 
  //       if(res.data.length>0){
  //         res.data = res.data.map(e => new MUsuarioSistema(e));  
  //       }
  //       return res;     
  //      })
      
  //   );

  // }  

  
   public procesarInstala(tipo:string,actual:boolean, anterior:boolean,id_usuario:number,token:any,URL:any ){    
    const body={
      actual,
      anterior,
      tipo    }

   return this.http.post<IResponse>(`${URL}/dao/ins/instala_dao.php?`,body, 
   {headers: {
     "Authorization": token,
     "Content-Type": "application/json"
  }})
   .pipe(  
     map((res: any) => {
         if (res.success) {
             res.data = res.data; //.map(element => new MSeguimiento(element));
         }
         return res
     })
   )
  }


}

