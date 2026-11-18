import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MUserDetail } from '@emiliocj18/sigesp-core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

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
  ) { }
  public href = environment.href;
  public showPassword: boolean = false;
  public showPasswordVer: boolean = false;
  public form: UntypedFormGroup = null;
  public user: MUserDetail = null;
  public baseSrc: string = '';
  public imgSrc: SafeResourceUrl = '';
  public selectedImage: File = null;
  public srcBase64: string = null;

  ngOnInit() {
    this.baseSrc = environment.production ?
      this.href + '/assets/foto_personal/':
      environment.url + '/assets/foto_personal/';

    // TODO-MIGRACION (§7.3): el perfil depende de usuario_dao.php. Se deshabilita
    // hasta exponer get/PUT/foto en NestJS.
    /*
    this.auth.getUserById(this.local.usuario.id).subscribe(res => {
      this.user = res.data
      this.imgSrc = this.baseSrc + this.user.photo
      this.form = this.fb.group({
        nom: [this.user.name, [Validators.required, Validators.maxLength(80)]],
        ape: [this.user.lastName, [Validators.required, Validators.maxLength(60)]],
        nac: [this.user.birthday, [Validators.required]],
        tel: [this.user.telephone, [Validators.required, Validators.maxLength(20)]],
        ema: [this.user.email, [Validators.required, Validators.maxLength(100)]],
      })
    })
    */
  }

  public onChangeInput(evt) {
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
    // TODO-MIGRACION (§7.3): updateUser contra usuario_dao.php deshabilitado.
    /*
    if(this.user.identification != null){
      this.auth.updateUser(this.form, this.user, this.srcBase64).subscribe(res => {
        this.user = res.data;
        var user: MUsuario = this.local.usuario;
        user.foto = this.user.photo;
        user.nombre = `${this.user.name} ${this.user.lastName}`;
        this.local.guardarUsuario(user);
        this._app.guardarUsuario(user)
        this.sigesp.showToastSuccess("Perfil actualizado exitosamente");
      })
    }
    */
  }

}
