import { BrowserModule } from '@angular/platform-browser';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { environment } from 'src/environments/environment';
import { API_URL } from '../core/config/api.config';
import { authInterceptor } from '../core/auth/auth.interceptor';
import { SessionBootstrapService } from '../core/auth/session-bootstrap.service';
import { AuthService } from '../core/services/auth/auth.service';
import { HttpAuthService } from '../core/services/auth/http-auth.service';
import { SystemService } from '../core/services/system/system.service';
import { HttpSystemService } from '../core/services/system/http-system.service';
import { MenuService } from '../core/services/menu/menu.service';
import { HttpMenuService } from '../core/services/menu/http-menu.service';
import { ProfileService } from '../core/services/profile/profile.service';
import { HttpProfileService } from '../core/services/profile/http-profile.service';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAppInitializer(() => inject(SessionBootstrapService).bootstrap()),
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: AuthService, useClass: HttpAuthService },
    { provide: SystemService, useClass: HttpSystemService },
    { provide: MenuService, useClass: HttpMenuService },
    { provide: ProfileService, useClass: HttpProfileService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
