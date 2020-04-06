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


const routes: Routes = [
  {path:'appdashboard', component:ApplicationDashboardComponent,canActivate: [AuthGuard]},
  {path:'oesdashboard', component:OesDashboardComponent,canActivate: [AuthGuard]},
  {path:'audit', component:AuditComponent},
  {path:'setup', component:ApplicationOnboardingComponent,children: [
    // child component of Setup i.e,ApplicationOnboardingComponent.
    {path: '' , component: ApplicationComponent},
    {path: 'datasource' , component: DataSourceComponent},
    {path: 'cloudservices' , component: CloudServicesComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
