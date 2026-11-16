import { Component, OnInit } from '@angular/core';
import { MUsuarioSistema } from 'sigesp';
// TODO-MIGRACION (§7.1): servicios PHP del menu deshabilitados temporalmente.
// import { ModuleManagerService } from '@core/services/module-manager.service';
// import { LocalService } from '@core/services/sigesp.service';
// import { SigespService } from 'sigesp';
// import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  public menu: MUsuarioSistema[] = [];
  public activoMenu: boolean = false;

  constructor() { }

  ngOnInit() {
    this.activoMenu = false;
    // TODO-MIGRACION (§7.1): el menu de sistemas se rehabilita cuando exista el
    // endpoint Nest equivalente a sistemas_dao.php.
    // this.getMenu(+this.sigesp.usuario.id, this.sigesp.usuario.token, servidor)
  }

  /*
  public mostrarAlert(texto: string){
    alert(texto)
  }

  private getMenu( id : number,token:any,url:any ) {
    return this.sigesp.getPerfilSistema(id,token,url)
      .subscribe( resp => {
        this.menu = resp.data;
        this.menu = this.menu.sort((a,b) => {
          if (+(a.tipoSistema) < +(b.tipoSistema)) return -1
          if (+(a.tipoSistema) > +(b.tipoSistema)) return 1
          return 0
        })
        this.activoMenu = true;
        this.menu.findIndex(e=> e.codigoSistema = "INS")>=0? this.ejecutarRelease(id,token,url):'';
        return resp;
    });
  }

  public ejecutarRelease(id,token,url){
    this.sigesp.procesarInstala('auto',true, false,id,token,url).subscribe((resp:any)=>{});
  }
  */
}
