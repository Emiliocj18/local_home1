import { Component, OnInit } from '@angular/core';
import { MUsuarioSistema } from '@emiliocj18/sigesp-core';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '@core/services/menu/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  public menu: MUsuarioSistema[] = [];
  public activoMenu: boolean = false;

  constructor(
    private readonly menuService: MenuService,
    private readonly toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getMenu();
  }

  private getMenu() {
    this.menuService.getMenu().subscribe({
      next: (resp) => {
        this.menu = resp;
        this.activoMenu = true;
      },
      error: (error: unknown) => {
        this.activoMenu = false;
        const message =
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los módulos.';
        this.toastr.error(message, 'Menú de sistemas');
      },
    });
  }

  // TODO-MIGRACION (§7.3): el flujo de release (sistema INS) depende de
  // instala_dao.php y se reactivará en una fase aparte.
  // public ejecutarRelease() { ... }
}
