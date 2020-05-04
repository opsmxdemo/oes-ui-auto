import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationDashboardComponent } from '../application-dashboard/application-dashboard.component';
import { OesDashboardComponent } from '../oes-dashboard/oes-dashboard.component';
import { AuthGuard } from '../guards/auth-guard.service';
import { AuditComponent } from '../audit/audit.component';
import { ApplicationOnboardingComponent } from '../application-onboarding/application-onboarding.component';
import { ApplicationComponent } from '../application-onboarding/application/application.component';
import { DataSourceComponent } from '../application-onboarding/data-source/data-source.component';
import { CloudServicesComponent } from '../application-onboarding/cloud-services/cloud-services.component';
import { AppliactionListComponent } from '../application-onboarding/appliaction-list/appliaction-list.component';
import { DynamicAccountsComponent } from '../application-onboarding/accounts/dynamic-accounts/dynamic-accounts.component';


const routes: Routes = [
  {path:'', redirectTo:'/setup/applications',pathMatch:'full'},
  {path:'appdashboard', component:ApplicationDashboardComponent},
  {path:'oesdashboard', component:OesDashboardComponent},
  {path:'audit', component:AuditComponent},
  {path:'setup', component:ApplicationOnboardingComponent, canActivate: [AuthGuard], children: [
    // child component of Setup i.e,ApplicationOnboardingComponent.
    {path: '', redirectTo:'/setup/applications',pathMatch:'full'},
    {path: 'applications' , component: AppliactionListComponent},
    {path: 'newApplication' , component: ApplicationComponent},
    {path: 'datasource' , component: DataSourceComponent},
    {path: 'cloudservices' , component: CloudServicesComponent},
    {path: 'accounts' , component: DynamicAccountsComponent}
  ]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
