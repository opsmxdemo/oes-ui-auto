import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationOnboardingComponent } from './application-onboarding.component';
import { AppliactionListComponent } from './application/appliaction-list/appliaction-list.component';
import { CreateApplicationComponent } from './application/application-creation/application.component';
import { ApplicationSetupComponent } from './application/application-setup/application-setup.component';
import { DataSourceComponent } from './data-source/data-source.component';
import { CloudServicesComponent } from './cloud-services/cloud-services.component';
import { DynamicAccountsComponent } from './accounts/dynamic-accounts/dynamic-accounts.component';
import { CreateAccountComponent } from './accounts/create-account/create-account.component';

const applicationOnboardingRoutes: Routes = [
    {path:'setup', component:ApplicationOnboardingComponent, children: [
        // child component of Setup i.e,ApplicationOnboardingComponent.
        {path: '', redirectTo:'/setup/applications',pathMatch:'full'},
        {path: 'applications' , component: AppliactionListComponent},
        // {path: 'newApplication' , component: CreateApplicationComponent},
        {path: 'application' , component: ApplicationSetupComponent},
        {path: 'application/:id' , component: ApplicationSetupComponent},
        {path: 'datasource' , component: DataSourceComponent},
        {path: 'cloudservices' , component: CloudServicesComponent},
        {path: 'accounts' , component: DynamicAccountsComponent},
        {path: 'newAccount', component: CreateAccountComponent}
      ]}
];

@NgModule({
  imports: [
      RouterModule.forChild(applicationOnboardingRoutes)
    ],
  exports: [RouterModule]
})
export class AppOnboardingRoutingModule {}