import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LocalService } from 'src/app/core/services/sigesp.service';
import { MConfiguracionDB } from 'src/app/core/models/configuracion-db.model';
import { AppComponent } from 'src/app/app/app.component';
import { ToastrService } from 'ngx-toastr';
import { SigespService } from 'sigesp';

@Component({
  selector: 'loginForm',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  public mensaje: string='';

  constructor(
    private authService: AuthService,
    private form: UntypedFormBuilder,
    private local: LocalService,
    private _app: AppComponent,
    private toastr: ToastrService,
    private sigesp: SigespService
  ) { }

  public loginForm: UntypedFormGroup = null;
  public basesDeDatos: MConfiguracionDB[] = [];
  public hide: boolean = true;
  public loaded: boolean = false;
  public showError: boolean = false;
  public sending: boolean = false;

  ngOnInit() {
    this.loginForm = this.form.group({
      usuario: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/[0-9a-zA-Z]{5,}/)]],
      clave: [null, [Validators.required, Validators.minLength(8)]],
      selectdb: [null, Validators.required]
    })
    this.authService.obtenerConfigDB().subscribe(res=>{
      this.basesDeDatos = res;
      this.loaded = true;
      if(res.length>0){
        this.loginForm.get('selectdb').setValue(this.basesDeDatos[0]);
      }
    })
  }

  public login(){
    this.sending = true;
    this.showError = false;
    
    this.authService.logIn(this.loginForm.value).subscribe((res: any) => {
      if (res.success) {
        this.local.guardarUsuario(res.data);
        this._app.guardarUsuario(res.data, true);
        this.sending = false; 
      } else {  
        if(res['resultado']=='error_querynull'){
          this.mensaje='Error de Conexión';          
        } else {  
            this.mensaje='El usuario o la clave son incorrectos';      

            let  newData= { usuario:'NO_AUTORIZADO', clave: 'adminerp', selectdb: this.loginForm.value.selectdb }     
             
            this.authService.logIn(newData).subscribe((res: any) => {
              if (res.success) { 
                  //this.local.guardarUsuario(res.data);
                  this.authService.UserNoAuthorized(this.loginForm.value,res.data.token).subscribe(  
                    (logRes: any) => {   

                      console.log("Log de intento fallido registrado", logRes);
                    },
                    (error) => {
                      console.error("Error al registrar el intento fallido:", error);
                    }
                  ); 
              } //res.sucess                 
            })
        }
        this.showError = true;
        this.sending = false;
      }
    })
  }

   public loginNew(){ 
    this.sending = true;
    this.showError = false;

    let  newData= { usuario:'', clave: '', selectdb: null }     

    if(this.loginForm.value['usuario']!='SIGESP' && this.loginForm.value['clave']!='adminerp'){
      newData=this.loginForm.value;
    }else{
      newData= { usuario:'NO_AUTORIZADO', clave: 'adminerp', selectdb: this.loginForm.value.selectdb }     
    }
    
    this.authService.logIn(newData).subscribe((res: any) => {
      if (res.success) {
        this.local.guardarUsuario(res.data);
        this._app.guardarUsuario(res.data, true);
        this.sending = false; 
      } else {  
        if(res['resultado']=='error_querynull'){
          this.mensaje='Error de Conexión';          
        } else {
            this.mensaje='El usuario o la clave son incorrectos';        
            this.authService.logIn(newData).subscribe((res: any) => {
              if (res.success) { 
                 this.authService.UserNoAuthorized(this.loginForm.value, res.data.token).subscribe(
                    (logRes: any) => {
                      console.log("Log de intento fallido registrado", logRes);
                    },
                    (error) => {
                      console.error("Error al registrar el intento fallido:", error);
                    }
                  ); 
              }           
            })
        }
        this.showError = true;
        this.sending = false;
      }
    })
  }


  
}
