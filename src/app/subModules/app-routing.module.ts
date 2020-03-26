import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationDashboardComponent } from '../application-dashboard/application-dashboard.component';
import { OesDashboardComponent } from '../oes-dashboard/oes-dashboard.component';
import { AuthGuard } from '../guards/auth-guard.service';


const routes: Routes = [
  {path:'appdashboard', component:ApplicationDashboardComponent,canActivate: [AuthGuard]},
  {path:'oesdashboard', component:OesDashboardComponent,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
