import { Component, OnInit } from '@angular/core';
import { ModuleManagerService } from '@core/services/module-manager.service';
import { LocalService } from '@core/services/sigesp.service';
import { MUsuarioSistema, SigespService } from 'sigesp';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public menu:MUsuarioSistema[]=[];
  public principal:MUsuarioSistema[]=[];
  public auxiliar:MUsuarioSistema[]=[];
  public configuracion:MUsuarioSistema[]=[];
  public activoMenu: boolean=false;
  public href = environment.href;
  public production = environment.production
  public fuentePhp= environment.fuentes_php;

  constructor(private sigesp: LocalService, 
    private sigesp2: SigespService, 
    private tabManager: ModuleManagerService,
    ){}

  ngOnInit() {
    this.activoMenu=false;
    let servidor= this.production ?
    this.href+this.fuentePhp:
    environment.url
    this.getMenu(+this.sigesp.usuario.id,this.sigesp.usuario.token,servidor)

  }
  mostrarAlert(texto: string){
    alert(texto)
  }
  
    private getMenu( id : number,token:any,url:any ) {     
      return this.sigesp.getPerfilSistema(id,token,url)
        .subscribe( resp => {         
            this.menu = resp.data;
            this.principal=this.menu.filter(e=>e.tipoSistema==1)
            this.auxiliar=this.menu.filter(e=>e.tipoSistema==2)
            this.configuracion=this.menu.filter(e=>e.tipoSistema==3)
            this.activoMenu = true;
            return resp;                       
      });
  } 

}
