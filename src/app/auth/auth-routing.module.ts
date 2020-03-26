import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { AuthGuard } from '../guards/auth-guard.service';


const authroutes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent},
    {path:'forgotpassword', component:ForgotpasswordComponent},

];

@NgModule({
  imports: [
      RouterModule.forChild(authroutes)
    ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }