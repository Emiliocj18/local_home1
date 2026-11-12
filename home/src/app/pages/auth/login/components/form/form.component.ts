import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private form: FormBuilder,
    private local: LocalService,
    private _app: AppComponent,
    private toastr: ToastrService,
    private sigesp: SigespService
  ) { }

  public loginForm: FormGroup = null;
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
           
            let  newData= { usuario:'SIGESP', clave: 'adminerp', selectdb: this.loginForm.value.selectdb }  
            
            this.authService.logIn(newData).subscribe((res: any) => {
              if (res.success) {
                 this.local.guardarUsuario(res.data);
                 this.authService.UserNoAuthorized(this.loginForm.value).subscribe(
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

  // public login(){
  //   this.sending = true;
  //   this.showError = false;
  //   this.authService.logIn(this.loginForm.value).subscribe((res: any) => {
  //     if (res.success) {
  //       this.local.guardarUsuario(res.data);
  //       this._app.guardarUsuario(res.data, true);
  //       this.sending = false;
  //     } else {
  //       if(res['resultado']=='error_querynull'){
  //         this.mensaje='Error de Conexión';          
  //       } else {
  //         this.mensaje='El usuario o la clave son incorrectos';                    
  //       }
  //       this.showError = true;
  //       this.sending = false;
  //     }
  //   })
  // }

}
