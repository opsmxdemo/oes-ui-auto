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
import { DynamicAccountsComponent } from '../application-onboarding/dynamic-accounts/dynamic-accounts.component';
import { PolicyManagementComponent } from '../policy-management/policy-management.component';
import { CreateAccountComponent } from '../application-onboarding/create-account/create-account.component';
import { DeploymentVerificationComponent } from '../application-dashboard/deployment-verification/deployment-verification.component';
import { AppsComponent } from '../application-dashboard/apps/apps.component'

const routes: Routes = [
  // {path:'appdashboard', component:ApplicationDashboardComponent, children: [
  //   {path:'deploymentverification', component: DeploymentVerificationComponent}
  // ]},
  {path:'application', component: AppsComponent, 
  children:[
    {path:'', component: ApplicationDashboardComponent},
    {path:'deploymentverification', component: DeploymentVerificationComponent,pathMatch:'full' }
  ]
},
  // children: [
  //   {path:'deploymentverification', component: DeploymentVerificationComponent}
  // ]},
 // {path: 'deploymentverification', component: DeploymentVerificationComponent},
  {path:'oesdashboard', component:OesDashboardComponent},
  {path:'audit', component:AuditComponent},
  {path:'policymanagement', component:PolicyManagementComponent},
  {path:'setup', component:ApplicationOnboardingComponent, children: [
    // child component of Setup i.e,ApplicationOnboardingComponent.
    {path: '', redirectTo:'/setup/applications',pathMatch:'full'},
    {path: 'applications' , component: AppliactionListComponent},
    {path: 'newApplication' , component: ApplicationComponent},
    {path: 'datasource' , component: DataSourceComponent},
    {path: 'cloudservices' , component: CloudServicesComponent},
    {path: 'accounts' , component: DynamicAccountsComponent},
    {path: 'newAccount', component: CreateAccountComponent}
  ]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
