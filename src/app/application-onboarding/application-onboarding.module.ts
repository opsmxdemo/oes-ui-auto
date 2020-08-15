import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import * as fromapplicationOnboarding from './store/feature.reducer'
import { AppMaterialModule } from 'src/app/subModules/app-material.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ApplicationOnboardingComponent } from './application-onboarding.component';
import { CreateApplicationComponent } from './application/application-creation/application.component';
import { AppliactionListComponent } from './application/appliaction-list/appliaction-list.component';
import { DataSourceComponent } from './data-source/data-source.component';
import { CloudServicesComponent } from './cloud-services/cloud-services.component';
import { DynamicAccountsComponent } from './accounts/dynamic-accounts/dynamic-accounts.component';
import { CreateAccountComponent } from './accounts/create-account/create-account.component';
import { GithubFormComponent } from './data-source/github-form/github-form.component';
import { NewrelicFormComponent } from './data-source/newrelic-form/newrelic-form.component';
import { PrometheusFormComponent } from './data-source/prometheus-form/prometheus-form.component';
import { DynatraceFormComponent } from './data-source/dynatrace-form/dynatrace-form.component';
import { GcpStackdriverFormComponent } from './data-source/gcp-stackdriver-form/gcp-stackdriver-form.component';
import { DatadogFormComponent } from './data-source/datadog-form/datadog-form.component';
import { AppDynamicsFormComponent } from './data-source/app-dynamics-form/app-dynamics-form.component';
import { AwsCloudwatchFormComponent } from './data-source/aws-cloudwatch-form/aws-cloudwatch-form.component';
import { ElasticsearchFormComponent } from './data-source/elasticsearch-form/elasticsearch-form.component';
import { DockerFormComponent } from './data-source/docker-form/docker-form.component';
import { ApplicationEffect } from './application/store/application.effects';
import { AccountsEffect } from './accounts/store/accounts.effects';
import { DataSourceEffect } from './data-source/store/data-source.effects';
import { AppOnboardingRoutingModule } from './application-onboarding-routing.module';
import { SharedModule } from '../subModules/shared.module';


@NgModule({
    declarations: [
      ApplicationOnboardingComponent,
      CreateApplicationComponent,
      AppliactionListComponent,
      DataSourceComponent,
      CloudServicesComponent,
      DynamicAccountsComponent,
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
     CommonModule,
     ReactiveFormsModule,
     FormsModule,
     SharedModule,
     HttpClientModule,
     AppMaterialModule,
     Ng2SearchPipeModule,
     AppOnboardingRoutingModule,
     StoreModule.forFeature('applicationOnboarding',fromapplicationOnboarding.applicationOnboardingReducers),
     EffectsModule.forFeature([
      ApplicationEffect,
      AccountsEffect,
      DataSourceEffect
     ])
    ],
  })
  export class ApplicationOnboardingModule { }
  