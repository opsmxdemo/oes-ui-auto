import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
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
  