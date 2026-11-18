import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionRefreshService } from '@core/auth/session-refresh.service';
import { SessionStore } from '@core/auth/session.store';
import { LoginPayload } from '@core/models/login-payload.model';
import { System } from '@core/models/system.model';
import { AuthService } from '@core/services/auth/auth.service';
import { SystemService } from '@core/services/system/system.service';

@Component({
  selector: 'loginForm',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class FormComponent implements OnInit {
  public mensaje: string = '';
  public loginForm: UntypedFormGroup = null;
  public systems: System[] = [];
  public systemsError: string = '';
  public hide: boolean = true;
  public loaded: boolean = false;
  public showError: boolean = false;
  public sending: boolean = false;

  constructor(
    private authService: AuthService,
    private form: UntypedFormBuilder,
    private systemService: SystemService,
    private session: SessionStore,
    private refresh: SessionRefreshService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loginForm = this.form.group({
      connectionId: [null, Validators.required],
      usuario: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/[0-9a-zA-Z]{5,}/)]],
      clave: [null, [Validators.required, Validators.minLength(8)]]
    })

    this.systemService.getSystems().subscribe({
      next: (systems) => {
        this.systems = systems;
        this.loaded = true;
        if (systems.length > 0) {
          this.loginForm.get('connectionId').setValue(systems[0].id);
        }
      },
      error: (error: Error) => {
        this.systemsError = error.message;
        this.loaded = true;
      }
    });
  }

  public login() {
    if (this.loginForm.invalid || this.sending) {
      return;
    }

    this.sending = true;
    this.showError = false;

    const values = this.loginForm.getRawValue();
    const system = this.systems.find((item) => item.id === String(values.connectionId));

    if (!system) {
      this.mensaje = 'Debe seleccionar una empresa.';
      this.showError = true;
      this.sending = false;
      return;
    }

    const payload: LoginPayload = {
      connectionId: Number(system.id),
      name: system.name,
      username: values.usuario,
      password: values.clave,
    };

    this.authService.login(payload).subscribe((res) => {
      this.sending = false;

      if (!res.success || !res.token || !res.usuario) {
        this.mensaje = res.message ?? 'El usuario o la clave son incorrectos';
        this.showError = true;
        return;
      }

      this.session.set(res.token, res.usuario);
      this.refresh.arm(res.token);
      this.router.navigate(['/home']);
    });
  }

  // TODO-MIGRACION: logica legacy (NO_AUTORIZADO / adminerp) pendiente de mover al backend.
  // Se conserva comentada para referencia (§7.5 del plan).
  /*
  public loginNew() {
    this.sending = true;
    this.showError = false;

    let newData = { usuario: '', clave: '', selectdb: null }

    if (this.loginForm.value['usuario'] != 'SIGESP' && this.loginForm.value['clave'] != 'adminerp') {
      newData = this.loginForm.value;
    } else {
      newData = { usuario: 'NO_AUTORIZADO', clave: 'adminerp', selectdb: this.loginForm.value.selectdb }
    }

    this.authService.logIn(newData).subscribe((res: any) => {
      if (res.success) {
        this.sending = false;
      } else {
        this.mensaje = 'El usuario o la clave son incorrectos';
        this.showError = true;
        this.sending = false;
      }
    })
  }
  */
}
