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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationOnboardingComponent } from './application-onboarding/application-onboarding.component';
import { ApplicationComponent } from './application-onboarding/application/application.component';
import { DataSourceComponent } from './application-onboarding/data-source/data-source.component';
import { ReleaseComponent } from './release/release.component';
import { CloudServicesComponent } from './application-onboarding/cloud-services/cloud-services.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { KeysPipe } from './pipes/keys.pipe';
import { ApplicationOnBoardingEffect } from './application-onboarding/store/onBoarding.effects';
import { AppliactionListComponent } from './application-onboarding/appliaction-list/appliaction-list.component';
import { AuditEffect } from './audit/store/audit.effects';
import { DynamicAccountsComponent } from './application-onboarding/dynamic-accounts/dynamic-accounts.component';
import { PolicyManagementComponent } from './policy-management/policy-management.component';
import { CreateAccountComponent } from './application-onboarding/create-account/create-account.component';
import { PolicyEffect } from './policy-management/store/policyManagement.effects';
import { GithubFormComponent } from './application-onboarding/data-source/github-form/github-form.component';
import { NewrelicFormComponent } from './application-onboarding/data-source/newrelic-form/newrelic-form.component';
import { PrometheusFormComponent } from './application-onboarding/data-source/prometheus-form/prometheus-form.component';
import { DynatraceFormComponent } from './application-onboarding/data-source/dynatrace-form/dynatrace-form.component';
import { GcpStackdriverFormComponent } from './application-onboarding/data-source/gcp-stackdriver-form/gcp-stackdriver-form.component';
import { DatadogFormComponent } from './application-onboarding/data-source/datadog-form/datadog-form.component';
import { AppDynamicsFormComponent } from './application-onboarding/data-source/app-dynamics-form/app-dynamics-form.component';
import { AwsCloudwatchFormComponent } from './application-onboarding/data-source/aws-cloudwatch-form/aws-cloudwatch-form.component';
import { ElasticsearchFormComponent } from './application-onboarding/data-source/elasticsearch-form/elasticsearch-form.component';
import { DockerFormComponent } from './application-onboarding/data-source/docker-form/docker-form.component';

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
    CloudServicesComponent,
    ReleaseComponent,
    KeysPipe,
    AppliactionListComponent,
    DynamicAccountsComponent,
    PolicyManagementComponent,
    CreateAccountComponent,
    GithubFormComponent,
    NewrelicFormComponent,
    PrometheusFormComponent,
    DynatraceFormComponent,
    GcpStackdriverFormComponent,
    DatadogFormComponent,
    AppDynamicsFormComponent,
    AwsCloudwatchFormComponent,
    ElasticsearchFormComponent,
    DockerFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppMaterialModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule.forRoot(),
    StoreModule.forRoot(fromApp.appReducers),
    EffectsModule.forRoot([AuthEffect,
                          LayoutEffect,
                          ApplicationOnBoardingEffect,
                          AuditEffect,
                          PolicyEffect]),
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: true,
    }),
    //please keep below import always in last position
    WildcardRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
