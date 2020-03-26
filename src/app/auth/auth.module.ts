import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
      LoginComponent,
      RegisterComponent,
      ForgotpasswordComponent
    ],
    imports: [
     CommonModule,
     ReactiveFormsModule,
     AuthRoutingModule,
     FormsModule,
     HttpClientModule
    ],
  })
  export class AuthModule { }
  