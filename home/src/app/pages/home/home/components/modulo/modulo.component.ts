import { Component, OnInit, Input } from '@angular/core';
import { LocalService } from '@core/services/sigesp.service';
import { environment } from 'src/environments/environment';
import { ModuleTab, ModuleTabRoute } from '@core/interfaces/interfaces';
import { ModuleManagerService } from '@core/services/module-manager.service';
import { MUsuarioSistema, SigespService } from 'sigesp';
import { Token } from '@angular/compiler';

@Component({
  selector: 'modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent implements OnInit {
  activoMenu: boolean;

  constructor(private sigesp: LocalService, 
    private sigesp2: SigespService, 
    private tabManager: ModuleManagerService,
    ) { }

  @Input() public nombre: string = null;
  @Input() public icono: string = null;
  @Input() public ruta: string = null;

  //public href = window.location.origin; actualmente -> http://localhost  /sigespERP
   
  /*se debe reemplazar por public href=environment.href y esto es igual a: "http://localhost/nombre_carpeta_base" */

  public href = environment.href;
  public production = environment.production
  public fuentePhp= environment.fuentes_php;
  public data: string = '';
 


        /*window.location.origin + '/sigesp_php' :   esta linea asignaba solo el path localhost o la ip.*/
      /*Por lo que se usa this.href que retornara la ruta con su carpeta base y luego concatena.*/

  ngOnInit() {
    let json = {
      usuario: this.sigesp.usuario,
      servidor: this.production ?
      this.href+this.fuentePhp:
      environment.url/* es igual a: http://localhost/nombre_carpeta_base/sigesp_php */
    }
    this.data = btoa(JSON.stringify(json))


  }

  


 



  public abrirModulo(){
    
    if (this.ruta) {

      let win: ModuleTabRoute = null;

      // win = {
      //   name: this.ruta,
      //   win: window.open(`${this.href}/${this.ruta}/auth/redirect?data=${this.data}`, '_blank')
      // }


      if (this.production) {
        win = {
          name: this.ruta,
          url: this.href + '/' + this.ruta + '/auth/redirect?data=' + this.data,
          href: this.href + '/' + this.ruta
        }
      } else {
        win = {
          name: this.ruta,
          url: 'http://localhost:4300/auth/redirect?data=' + this.data,
          href: 'http://localhost:4300'
        }
        // win.win.focus();
        // window.open(`http://localhost/${this.ruta}/auth/redirect?data=${this.data}`, '_blank')
      }

      this.tabManager.addTab(win)

    }
  }

}
