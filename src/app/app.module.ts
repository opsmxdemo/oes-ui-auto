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
import { WildcardRoutingModule } from './subModules/wildcardRouting.module';
import { LayoutEffect } from './layout/store/layout.effects';
import { FormsModule } from '@angular/forms';
import { ApplicationOnboardingComponent } from './application-onboarding/application-onboarding.component';
import { ApplicationComponent } from './application-onboarding/application/application.component';
import { DataSourceComponent } from './application-onboarding/data-source/data-source.component';
import { CloudServicesComponent } from './application-onboarding/cloud-services/cloud-services.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ApplicationDashboardComponent,
    OesDashboardComponent,
    AuditComponent,
    ApplicationOnboardingComponent,
    ApplicationComponent,
    DataSourceComponent,
    CloudServicesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    FormsModule,
    HttpClientModule,
    AppMaterialModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(fromApp.appReducers),
    EffectsModule.forRoot([AuthEffect,LayoutEffect]),
    //please keep below import always in last position
    WildcardRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
