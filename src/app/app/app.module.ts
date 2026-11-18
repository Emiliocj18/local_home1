import { BrowserModule } from '@angular/platform-browser';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../shared/material/material.module';
import { AppModule as SigespModule } from '@emiliocj18/sigesp-core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
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

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    SigespModule
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAppInitializer(() => inject(SessionBootstrapService).bootstrap()),
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: AuthService, useClass: HttpAuthService },
    { provide: SystemService, useClass: HttpSystemService },
    { provide: MenuService, useClass: HttpMenuService },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL']
        },
        display: {
          dateInput: 'LL',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
