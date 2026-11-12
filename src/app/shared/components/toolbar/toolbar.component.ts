import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (window.scrollY < 70) {
      this.offset = window.scrollY;
    } else {
      this.offset = 70;
    }
  }

  @Input() public mostrarCrear: boolean = true;
  @Input() public mostrarGuardar: boolean = true;
  @Input() public mostrarBorrar: boolean = true;
  @Input() public mostrarBuscar: boolean = true;
  @Input() public mostrarImprimir: boolean = true;
  @Input() public mostrarSalir: boolean = true;

  @Input() public desabilitarCrear: boolean = false;
  @Input() public desabilitarGuardar: boolean = false;
  @Input() public desabilitarBorrar: boolean = false;
  @Input() public desabilitarBuscar: boolean = false;
  @Input() public desabilitarImprimir: boolean = false;
  @Input() public desabilitarSalir: boolean = false;

  @Output() public crear = new EventEmitter<boolean>();
  @Output() public guardar = new EventEmitter<boolean>();
  @Output() public borrar = new EventEmitter<boolean>();
  @Output() public buscar = new EventEmitter<boolean>();
  @Output() public imprimir = new EventEmitter<boolean>();

  public offset: number = 0;

  ngOnInit() {
    if (window.scrollY < 70) {
      this.offset = window.scrollY;
    } else {
      this.offset = 70;
    }
  }

  public emitNew(){
    this.crear.emit(true)
  }

  public emitSave(){
    this.guardar.emit(true)
  }

  public emitDelete(){
    this.borrar.emit(true)
  }

  public emitSearch(){
    this.buscar.emit(true)
  }

  public emitPrint(){
    this.imprimir.emit(true)
  }

  public emitExit(){
    this.router.navigate(['/home']);
  }

}
