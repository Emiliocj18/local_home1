import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MUsuarioSistema } from '@emiliocj18/sigesp-core';
import { MenuService } from '@core/services/menu/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeComponent implements OnInit {
  public menu: MUsuarioSistema[] = [];
  public activoMenu: boolean = false;

  constructor(
    private readonly menuService: MenuService,
    private readonly snackBar: MatSnackBar,
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
        this.showError(`Menú de sistemas: ${message}`);
      },
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: 'sigesp-snackbar-error',
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  // TODO-MIGRACION (§7.3): el flujo de release (sistema INS) depende de
  // instala_dao.php y se reactivará en una fase aparte.
  // public ejecutarRelease() { ... }
}
