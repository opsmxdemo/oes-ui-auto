import { TrendAnalysisComponent } from './../application/trend-analysis/trend-analysis.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationDashboardComponent } from '../application/application-dashboard/application-dashboard.component';
import { AuthGuard } from '../guards/auth-guard.service';
import { AuditComponent } from '../audit/audit.component';
import { PolicyManagementComponent } from '../policy-management/policy-management.component';
import { DeploymentVerificationComponent } from '../application/deployment-verification/deployment-verification.component';
import { ApplicationComponent } from '../application/application.component';
import { CdDashboardComponent } from '../cd-dashboard/cd-dashboard.component';
import { AppErrorListingComponent } from '../error-handling/app-error-listing/app-error-listing.component';
import { VisibilityComponent } from '../visibility/visibility.component';

const routes: Routes = [
  
  {path:'application', component: ApplicationComponent, children:[
    {path:'', component: ApplicationDashboardComponent},
    {path:'deploymentverification', component: DeploymentVerificationComponent},
    {path:'deploymentverification/:applicationName/:canaryId', component: DeploymentVerificationComponent},
    { path: 'deploymentverification/:applicationName/:canaryId/:serviceId', component: DeploymentVerificationComponent },
    { path: 'trendanalysis', component: TrendAnalysisComponent },

  ]},
  {path:'cddashboard', component:CdDashboardComponent},
  {path:'audit', component:AuditComponent},
  {path:'visibility', component: VisibilityComponent},
  {path:'policymanagement', component:PolicyManagementComponent},
  {path:'error', component:AppErrorListingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
