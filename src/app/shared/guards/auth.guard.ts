import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalService } from 'src/app/core/services/sigesp.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private sigesp: LocalService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.sigesp.sesionActiva()) {
      // En el caso de no estar autenticado no poder acceder a los components establecidos
      this.router.navigate(['/auth/login']);
      return false;
    } else {
      // en en caso de estar autenticado perimte la entrada a los component necesarios
      return true;
    }
  }

}
