import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MUserDetail } from '@emiliocj18/sigesp-core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Perfil } from '@core/models/perfil.model';
import { ProfileService } from '@core/services/profile/profile.service';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ProfileComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private fb: UntypedFormBuilder,
    private profileService: ProfileService,
    private toast: ToastService,
  ) { }

  public href = environment.href;
  public form: UntypedFormGroup = null;
  public user: MUserDetail = null;
  public baseSrc: string = '';
  public imgSrc: SafeResourceUrl | string = '';
  public selectedImage: File = null;
  public srcBase64: string = null;
  public loading: boolean = false;
  public saving: boolean = false;
  public error: string = '';

  ngOnInit() {
    this.baseSrc = environment.production ?
      this.href + '/assets/foto_personal/':
      environment.url + '/assets/foto_personal/';

    this.load();
  }

  public onChangeInput(evt: any) {
    // La foto esta en standby; el guard evita el TypeError si se reactiva.
    if (!this.user) {
      return;
    }

    const files: FileList = evt.target.files;

    if (files.length === 0) {
      return;
    }

    const image = files[0];

    if (!image.type.match('image.*')) {
      return;
    }

    this.selectedImage = image;
    const format = image.type.replace('image/', '');
    this.user.photo = `${this.user.identification}.${format}`;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.srcBase64 = e.target.result;
    };
    reader.readAsDataURL(image);
    this.imgSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image));
  }

  public save() {
    if (!this.user || !this.form || this.form.invalid || this.saving) {
      return;
    }

    const values = this.form.getRawValue();

    this.saving = true;
    this.profileService
      .updateProfile({ telefono: values.tel, email: values.ema })
      .subscribe({
        next: (perfil) => {
          this.applyPerfil(perfil);
          this.saving = false;
          this.toast.success('Perfil actualizado exitosamente');
        },
        error: (err: Error) => {
          this.saving = false;
          this.toast.error(err.message);
        },
      });
  }

  private load() {
    this.loading = true;
    this.error = '';

    this.profileService.getProfile().subscribe({
      next: (perfil) => {
        this.applyPerfil(perfil);
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  private applyPerfil(perfil: Perfil) {
    this.user = new MUserDetail();
    this.user.id = perfil.idUsuario;
    this.user.idEnterprise = perfil.idEmpresa;
    this.user.id_personal = perfil.idPersonal;
    this.user.username = perfil.codusu;
    this.user.name = perfil.nombre;
    this.user.lastName = perfil.apellido;
    this.user.identification = perfil.cedula;
    this.user.cedula = perfil.cedula;
    this.user.email = perfil.email ?? '';
    this.user.telephone = perfil.telefono ?? '';
    this.user.birthday = perfil.fechaNacimiento ?? '';
    this.user.photo = perfil.foto ?? '';
    this.imgSrc = this.user.photo ? this.baseSrc + this.user.photo : '';

    this.form = this.fb.group({
      nom: [this.user.name, [Validators.required, Validators.maxLength(80)]],
      ape: [this.user.lastName, [Validators.required, Validators.maxLength(60)]],
      nac: [perfil.fechaNacimiento ?? ''],
      tel: [this.user.telephone, [Validators.required, Validators.maxLength(20)]],
      ema: [this.user.email, [Validators.required, Validators.maxLength(100)]],
    });
  }

}
