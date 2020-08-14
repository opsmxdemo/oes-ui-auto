import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationDashboardComponent } from '../application/application-dashboard/application-dashboard.component';
import { AuthGuard } from '../guards/auth-guard.service';
import { AuditComponent } from '../audit/audit.component';
import { PolicyManagementComponent } from '../policy-management/policy-management.component';
import { DeploymentVerificationComponent } from '../application/deployment-verification/deployment-verification.component';
import { ApplicationComponent } from '../application/application.component';
import { CdDashboardComponent } from '../cd-dashboard/cd-dashboard.component';

const routes: Routes = [
  {path:'application', component: ApplicationComponent, children:[
    {path:'', component: ApplicationDashboardComponent},
    {path:'deploymentverification', component: DeploymentVerificationComponent}
  ]},
  {path:'oesdashboard', component:CdDashboardComponent},
  {path:'audit', component:AuditComponent},
  {path:'policymanagement', component:PolicyManagementComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
