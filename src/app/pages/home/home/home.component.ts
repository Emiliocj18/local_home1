import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ModuloSistema } from '@core/models/modulo-sistema.model';
import { MenuService } from '@core/services/menu/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeComponent implements OnInit {
  public menu: ModuloSistema[] = [];
  public activoMenu: boolean = false;
  public error: string | null = null;

  constructor(
    private readonly menuService: MenuService,
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
        this.error =
          error instanceof Error
            ? `Menú de sistemas: ${error.message}`
            : 'No se pudieron cargar los módulos.';
      },
    });
  }

  // TODO-MIGRACION (§7.3): el flujo de release (sistema INS) depende de
  // instala_dao.php y se reactivará en una fase aparte.
  // public ejecutarRelease() { ... }
}
