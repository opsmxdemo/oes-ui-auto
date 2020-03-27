import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationDashboardComponent } from '../application-dashboard/application-dashboard.component';
import { OesDashboardComponent } from '../oes-dashboard/oes-dashboard.component';
import { AuthGuard } from '../guards/auth-guard.service';
import { AuditComponent } from '../audit/audit.component';


const routes: Routes = [
  {path:'appdashboard', component:ApplicationDashboardComponent,canActivate: [AuthGuard]},
  {path:'oesdashboard', component:OesDashboardComponent,canActivate: [AuthGuard]},
  {path:'audit', component:AuditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
