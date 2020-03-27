import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as fromApp from './store/app.reducer';
import { AppRoutingModule } from './subModules/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppMaterialModule } from './subModules/app-material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthModule } from './auth/auth.module';
import { HeaderComponent } from './layout/header/header.component';
import { AuthEffect } from './auth/store/auth.effects';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationDashboardComponent } from './application-dashboard/application-dashboard.component';
import { OesDashboardComponent } from './oes-dashboard/oes-dashboard.component';
import { AuditComponent } from './audit/audit.component';
import { AuthInterceptor } from './auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ApplicationDashboardComponent,
    OesDashboardComponent,
    AuditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    HttpClientModule,
    AppMaterialModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(fromApp.appReducers),
    EffectsModule.forRoot([AuthEffect])
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
