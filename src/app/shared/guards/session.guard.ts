import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalService } from 'src/app/core/services/sigesp.service';
//import { CanActivate, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
//import { Observable } from 'rxjs';

export const sessionGuard: CanActivateFn = () => {
  const router = inject(Router);
  const sigesp = inject(LocalService);
  if (sigesp.sesionActiva()) { router.navigate(['/home']); return false; }
  return true;
};

//Actualizar import en auth-routing.module.ts

//Anteriormente

/*@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  constructor(private router: Router, private sigesp: LocalService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.sigesp.sesionActiva()) {
      // En el caso de estar autenticado no poder acceder a los components establecidos
      this.router.navigate(['/home']);
      return false;
    } else {
      // en en caso de no estar autenticado perimte la entrada a los component necesarios
      return true;
    }
  }
}*/
