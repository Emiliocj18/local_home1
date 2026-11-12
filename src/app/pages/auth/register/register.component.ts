import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MConfiguracionDB } from '@core/models/configuracion-db.model';
import { AuthService } from '@core/services/auth.service';
import { LocalService } from '@core/services/sigesp.service';
import { ToastrService } from 'ngx-toastr';
import { SigespService } from 'sigesp';
import { AppComponent } from 'src/app/app/app.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private form: UntypedFormBuilder,
    private local: LocalService,
    private _app: AppComponent,
    private toastr: ToastrService,
    private router: Router
  ) { }

  public signUpForm: UntypedFormGroup = null;
  public basesDeDatos: MConfiguracionDB[] = [];
  public hide: boolean = true;
  public loaded: boolean = false;
  public showError: boolean = false;
  public sending: boolean = false;

  ngOnInit() {
    this.signUpForm = this.form.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/[0-9a-zA-Z]{5,}/)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/[0-9a-zA-Z]{5,}/)]],
      lastname: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/[0-9a-zA-Z]{5,}/)]],
      id: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/[0-9a-zA-Z]{5,}/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passver: ['', [Validators.required, Validators.minLength(8)]],
      selectdb: [null, Validators.required]
    })
    this.authService.obtenerConfigDB().subscribe(res=>{
      this.basesDeDatos = res;
      // console.log(this.basesDeDatos)
      this.loaded = true;
    })
  }

  public login(){
    // this.sending = true; 
    this.showError = false;
    this.authService.signUp(this.signUpForm.value).subscribe((res: any) => {
      // console.log(res)
      if (res.success) {
        this.toastr.success("Cuenta creada exitosamente")
        this.router.navigate(['auth', 'login'])
        // this.local.guardarUsuario(res.data);
        // this._app.guardarUsuario(res.data, true);
        // this.sending = false;
      } else {
        this.toastr.error(res.message)
        // this.showError = true;
        // this.sending = false;
      }
    })
  }

}
