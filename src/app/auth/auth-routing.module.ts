import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

const authroutes: Routes = [
  // {path:'login', component:LoginComponent},
  //   {path:'forgotpassword', component:ForgotpasswordComponent},

];

@NgModule({
  imports: [
      RouterModule.forChild(authroutes)
    ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }