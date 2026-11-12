import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { MUserDetail, SigespService, MUsuario } from 'sigesp';
//import { MUsuario } from '@core/models/usuario.model';
import { LocalService } from '@core/services/sigesp.service'
import { AuthService } from '@core/services/auth.service';
import { environment } from 'src/environments/environment';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app/app.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private auth: AuthService,
    private local: LocalService,
    private fb: UntypedFormBuilder,
    private _app: AppComponent,
    private sigesp: SigespService
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
  }

  public onChangeInput(evt) {
    const image = evt.target.files;

    if (image.length > 0) {
      for (let i = 0, f; f = image[i]; i++) {
        if (!f.type.match('image.*')) {
          continue;
        }
        this.selectedImage = image[0];
        var format: string = this.selectedImage.type.replace('image/', '');
        this.user.photo = `${this.user.identification}.${format}`
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.srcBase64 = e.target.result;
        }
        reader.readAsDataURL(this.selectedImage);
        this.imgSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedImage))
      }
    }
  }

  public save(){
   
    if(this.user.identification != null){
          this.auth.updateUser(this.form,  this.user, 
        this.srcBase64
      ).subscribe(res => {
        this.user = res.data;
        var user: MUsuario = this.local.usuario; 
        user.foto = this.user.photo;
        user.nombre = `${this.user.name} ${this.user.lastName}`;
        this.local.guardarUsuario(user);
        this._app.guardarUsuario(user)
        this.sigesp.showToastSuccess("Perfil actualizado exitosamente");
      })
    }
   
  }

   

}
