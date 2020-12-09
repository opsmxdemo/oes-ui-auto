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
import { NonAdminPipe } from '../pipes/nonAdmin.pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { ConnectorTemplateConfigComponent } from './application/application-creation/connector-template-config/connector-template-config.component';
import { ConnectorTemplateConfigService } from './application/application-creation/connector-template-config/connector-template-config.service';
import { ConnectorTemplateRowComponent } from './application/application-creation/connector-template-config/connector-template-row/connector-template-row.component';
import { ConnectorTemplateComponent } from './application/application-creation/connector-template-config/connector-template/connector-template.component';
import { LogTemplateConfigComponent } from './application/application-creation/log-template-config/log-template-config.component';
import { LogTemplateFormComponent } from './application/application-creation/log-template-config/log-template-form/log-template-form.component';
import { LogTemplateEditorComponent } from './application/application-creation/log-template-config/log-template-editor/log-template-editor.component';
import { LogProviderComponent } from './application/application-creation/log-template-config/log-provider/log-provider.component';
import { LogTopicsComponent } from './application/application-creation/log-template-config/log-topics/log-topics.component';
import { LogTagsComponent } from './application/application-creation/log-template-config/log-tags/log-tags.component';
import { LogTemplateConfigService } from './application/application-creation/log-template-config/log-template-config.service';
import { LogTopicsService } from './application/application-creation/log-template-config/log-topics/log-topics.service';
import { OpsMxFormsModule } from 'projects/forms/src';
import { ApplicationSetupComponent } from './application/application-setup/application-setup.component';
import { ApplicationRoadMapComponent } from './application/application-setup/application-road-map/application-road-map.component';
import { ApplicationDetailsComponent } from './application/application-setup/application-details/application-details.component';
import { DevelopmentVerificationConfigComponent } from './application/application-setup/development-verification-config/development-verification-config.component';
import { MetricTemplateConfigComponent } from './application/application-setup/metric-template-config/metric-template-config.component';
import { VisibilityConfigComponent } from './application/application-setup/visibility-config/visibility-config.component';
import { ReleaseManagementConfigComponent } from './application/application-setup/release-management-config/release-management-config.component';
import { AddEnvironmentComponent } from './application/application-setup/add-environment/add-environment.component';
import { GroupPermissionComponent } from './application/application-setup/group-permission/group-permission.component';
import { ApplicationServiceComponent } from './application/application-setup/application-service/application-service.component';
import { ServiceFeaturesComponent } from './application/application-setup/service-features/service-features.component';


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
      CreateDataSourceComponent,
      NonAdminPipe,
      ConnectorTemplateConfigComponent,
      ConnectorTemplateRowComponent,
      ConnectorTemplateComponent,
      LogTemplateConfigComponent,
      LogTemplateFormComponent,
      LogTemplateEditorComponent,
      LogProviderComponent,
      LogTopicsComponent,
      LogTagsComponent,
      ApplicationSetupComponent,
      ApplicationRoadMapComponent,
      ApplicationDetailsComponent,
      DevelopmentVerificationConfigComponent,
      MetricTemplateConfigComponent,
      VisibilityConfigComponent,
      ReleaseManagementConfigComponent,
      AddEnvironmentComponent,
      GroupPermissionComponent,
      ApplicationServiceComponent,
      ServiceFeaturesComponent   ],
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
     ]),
     ClipboardModule,
     OpsMxFormsModule
    ],
    providers: [ConnectorTemplateConfigService, LogTemplateConfigService]
  })
  export class ApplicationOnboardingModule { }
  