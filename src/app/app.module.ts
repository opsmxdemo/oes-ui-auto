import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import * as fromApp from './store/app.reducer';
import { AppRoutingModule } from './subModules/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppMaterialModule } from './subModules/app-material.module';
import { StoreModule } from '@ngrx/store';
import { AuthModule } from './auth/auth.module';
import { HeaderComponent } from './layout/header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationDashboardComponent } from './application/application-dashboard/application-dashboard.component';
import { AuditComponent } from './audit/audit.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { WildcardRoutingModule } from './subModules/wildcardRouting.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReleaseComponent } from './release/release.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PolicyManagementComponent } from './policy-management/policy-management.component';
import { DeploymentVerificationModule } from './application/deployment-verification/deployment-verification.module';
import { AppConfigService } from './services/app-config.service';
import { TreeViewComponent } from './audit/tree-view/tree-view.component';
import { TableRowComponent } from './audit/tree-view/table-row/table-row.component';
import { ApplicationComponent } from './application/application.component';
import { HasChildComponent } from './audit/tree-view/has-child/has-child.component';
import { CdDashboardComponent } from './cd-dashboard/cd-dashboard.component';
import { ChartsModule } from './subModules/charts.module';
import { EffectModule } from './store/app.effects';
import { ApplicationOnboardingModule } from './application-onboarding/application-onboarding.module';
import { SharedModule } from './subModules/shared.module';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { TrendAnalysisComponent } from './application/trend-analysis/trend-analysis.component'; 
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VisibilityComponent } from './visibility/visibility.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Below function is use to fetch endpointUrl from file present in assets/config location.
const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
      return appConfig.loadAppConfig();
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ApplicationDashboardComponent,
    AuditComponent,
    ApplicationComponent,
    ReleaseComponent,
    PolicyManagementComponent,
    TreeViewComponent,
    TableRowComponent,
    HasChildComponent,
    CdDashboardComponent,
    TrendAnalysisComponent,
    VisibilityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    SharedModule,
    BrowserAnimationsModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppMaterialModule,
    MatTooltipModule,
    Ng2SearchPipeModule,
    NgJsonEditorModule,
    EffectModule,
    NgxChartsModule,
    ApplicationOnboardingModule,
    DeploymentVerificationModule,
    NgMultiSelectDropDownModule.forRoot(),
    StoreModule.forRoot(fromApp.appReducers),
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: true,
    }),
    //please keep below WildcardRoutingModule always in last position.
    WildcardRoutingModule,
    NgxJsonViewerModule,
    FontAwesomeModule
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
