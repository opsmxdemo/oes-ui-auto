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
import { ApplicationEffect } from './application/store/application.effects';
import { AccountsEffect } from './accounts/store/accounts.effects';
import { DataSourceEffect } from './data-source/store/data-source.effects';
import { AppOnboardingRoutingModule } from './application-onboarding-routing.module';
import { SharedModule } from '../subModules/shared.module';
import { MetricTemplateComponent } from './application/application-creation/metric-template/metric-template.component';
import { LogTemplateComponent } from './application/application-creation/log-template/log-template.component';
import { LogTemplateEffect } from './application/application-creation/log-template/store/logTemplate.effects';
import { MetricTemplateEffect } from './application/application-creation/metric-template/store/metricTemplate.effects';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { CreateDataSourceComponent } from './data-source/create-data-source/create-data-source.component';
import { DataSourceFormsComponent } from './data-source/create-data-source/data-source-forms/data-source-forms.component';


@NgModule({
    declarations: [
      ApplicationOnboardingComponent,
      CreateApplicationComponent,
      AppliactionListComponent,
      DataSourceComponent,
      CloudServicesComponent,
      DynamicAccountsComponent,
      CreateAccountComponent,
      MetricTemplateComponent,
      LogTemplateComponent,
      DataSourceFormsComponent,
      CreateDataSourceComponent
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
     NgJsonEditorModule,
     StoreModule.forFeature('applicationOnboarding',fromapplicationOnboarding.applicationOnboardingReducers),
     EffectsModule.forFeature([
      ApplicationEffect,
      AccountsEffect,
      DataSourceEffect,
      LogTemplateEffect,
      MetricTemplateEffect
     ])
    ],
  })
  export class ApplicationOnboardingModule { }
  