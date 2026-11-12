import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'auth', loadChildren: () => import('../pages/auth/auth.module').then(m => m.AuthModule) },
  { path: 'perfil', loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfileModule) },
  { path: '', loadChildren: () => import('../pages/home/home.module').then(m => m.HomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
