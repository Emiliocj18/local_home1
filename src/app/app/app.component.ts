import { Component, OnInit, HostListener, effect, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ModuleManagerService } from '@core/services/module-manager.service';
import { ModuleTabRoute } from '@core/interfaces/interfaces';
import { environment } from 'src/environments/environment';
import { MUsuario, MUsuarioSistema } from '@emiliocj18/sigesp-core';
import { SessionStore } from '../core/auth/session.store';
import { SessionRefreshService } from '../core/auth/session-refresh.service';
import { AuthService } from '../core/services/auth/auth.service';
import { mapToMUsuario } from '../core/mappers/m-usuario.mapper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AppComponent implements OnInit {
  public usuario: MUsuario;
  public imgSrc: string;
  public sistema: string = environment.sistema;
  public titulo: string = '';
  public base: string = '';
  public parentesis1: string = '';
  public parentesis2: string = '';
  public menu: MUsuarioSistema[] = [];
  public principal: MUsuarioSistema[] = [];
  public auxiliar: MUsuarioSistema[] = [];
  public herramienta: MUsuarioSistema[] = [];
  public activoMenu: boolean;
  public nombre: string;
  // Oculta el shell (header/footer) cuando se renderiza una pantalla de auth.
  public isAuthRoute = signal(false);
  // Sidebar móvil (overlay) y título de página dinámico para la topbar.
  public sidebarOpen = signal(false);
  public pageTitle = signal('Inicio');

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
    private router: Router,
    private tabManager: ModuleManagerService,
    private session: SessionStore,
    private refresh: SessionRefreshService,
    private auth: AuthService,
  ) {
    // La sesion vive en SessionStore; el header se sincroniza de forma reactiva.
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isAuthRoute.set(event.urlAfterRedirects.startsWith('/auth'));
        this.pageTitle.set(this.resolveTitle(event.urlAfterRedirects));
      });

    effect(() => {
      const user = this.session.user();
      const token = this.session.token();

      if (user) {
        this.usuario = mapToMUsuario(user, token ?? '');
        this.applyUsuario(this.usuario);
      } else {
        this.usuario = null;
        this.titulo = '';
        this.base = '';
        this.parentesis1 = '';
        this.parentesis2 = '';
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    return false;
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.tabManager.closeAll();
  }

  ngOnInit() {
    this.imgSrc = environment.production ?
      window.location.origin + '/' + environment.carpeta + '/assets/foto_personal/' :
      environment.href + '/assets/foto_personal/'
  }

  private applyUsuario(usuario: MUsuario) {
    const gestor = usuario.conexionDB?.gestor as any;

    this.titulo = usuario.empresa?.titulo ?? '';
    usuario.sistema = environment.sistema;
    this.sistema = environment.sistema;
    this.base = gestor?.nombrebase ?? '';
    this.nombre = (!usuario.nombre || usuario.nombre === 'null')
      ? gestor?.l_usuario
      : usuario.nombre;
    this.parentesis1 = '(';
    this.parentesis2 = ')';
  }

  public guardarUsuario(usuario: MUsuario, iniciarSesion: boolean = false) {
    this.usuario = usuario;

    if (usuario) {
      this.applyUsuario(usuario);
    }

    if (iniciarSesion) {
      this.router.navigate(['/home'])
    }
  }

  public cerrarSesion() {
    this.auth.logout().subscribe({
      next: () => this.finalizeLogout(),
      error: () => this.finalizeLogout(),
    });
  }

  private finalizeLogout() {
    this.refresh.cancel();
    this.session.clear();
    this.tabManager.closeAll();
    this.usuario = null;
    this.sistema = environment.sistema;
    this.titulo = '';
    this.router.navigate(['/auth/login'])
  }

  public openModule(route: ModuleTabRoute) {
    if (!environment.ssoEnabled) {
      return;
    }
    // TODO(SSO): pedir un codigo de un solo uso a Nest y abrir el modulo con
    // ?code=<code>. No volver a enviar btoa(JSON.stringify(usuario)) por la URL.
  }

  // Título de la topbar según la ruta activa.
  private resolveTitle(url: string): string {
    if (url.includes('/perfil')) return 'Mi perfil';
    if (url.includes('/home')) return 'Inicio';
    return 'Panel';
  }

}
