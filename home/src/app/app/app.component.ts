import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { LocalService } from '../core/services/sigesp.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModuleManagerService } from '@core/services/module-manager.service';
import { ModuleTabRoute } from '@core/interfaces/interfaces';
import { environment } from 'src/environments/environment';
import { MUsuario, MUsuarioSistema, SigespService } from 'sigesp';
//import { MUsuario } from '@core/models/usuario.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public usuario: MUsuario;
  public imgSrc: string;
  public prod: boolean = environment.production
  public sistema:string=environment.sistema;
  public titulo:string='';
  public base:string='';
  public parentesis1:string='';
  public parentesis2:string='';
  public  menu: MUsuarioSistema[]=[];
  public  principal: MUsuarioSistema[]=[];
  public  auxiliar: MUsuarioSistema[]=[];
  public  herramienta: MUsuarioSistema[]=[];
  public activoMenu: boolean;

  public rutas: ModuleTabRoute[] = [
    {
      name: 'Inicio',
      url: '/home',
      icon: 'home',
      children: [],
      externalLink: false
    },
    {
      name: 'Perfil',
      icon: 'person',
      url: '/perfil',
      children: [],
      externalLink: false
    }
  
  ]
  constructor(
    private sigesp: LocalService,
    private router: Router,
    private tabManager: ModuleManagerService,
    private sigespService:SigespService,
  ) {}

  

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
      return false;
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {

      this.tabManager.closeAll();
  }

  ngOnInit() {
    
    if (this.sigesp.sesionActiva()) {
      this.usuario = this.sigesp.usuario;
      this.titulo='';
      this.sistema='';
      this.base='';
      this.parentesis1='';
      this.parentesis2='';  
      this.titulo=this.usuario.empresa.titulo;
      this.usuario.sistema=environment.sistema;
      this.sistema=environment.sistema;
      this.base=this.usuario.conexionDB.gestor['nombrebase'];

    }
    this.imgSrc = environment.production ?
    window.location.origin + '/'+environment.carpeta+environment.fuentes_php+'/assets/user/':
    environment.url + '/assets/user/'
  }

  public guardarUsuario(usuario: MUsuario, iniciarSesion: boolean = false) {
    this.usuario = usuario;
    if (iniciarSesion) {      
      this.router.navigate(['/home'])
      this.parentesis1='(';
      this.parentesis2=')';
      this.titulo=this.usuario.empresa.titulo;
      this.usuario.sistema=environment.sistema;
      this.sistema=environment.sistema;
      this.base=this.usuario.conexionDB.gestor['nombrebase'];
      
    }
  }

  public cerrarSesion() {
    this.usuario = null;
    this.sigesp.cerrarSesion();
    this.router.navigate(['/auth/login'])
    this.tabManager.closeAll()
    this.sistema=environment.sistema;
    this.titulo='';
  }



 

  public openModule(route: ModuleTabRoute) {
    
    let json = {
      usuario: this.usuario,
      servidor: this.prod ?
      window.location.origin :
      environment.url
    }

    

    let data = btoa(JSON.stringify(json))

    let href: string = window.location.origin

    route = {
      name: route.name,
      url: 
      this.prod ? href + '/' + route.url + '/auth/redirect?data=' + data 
      : 'http://localhost:4300/auth/redirect?data=' + data,
      href: this.prod ? href + '/' + route.url : 'http://localhost:4300'
    }
    this.tabManager.addTab(route)
  }

}
