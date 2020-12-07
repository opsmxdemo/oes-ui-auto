import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OpsMxInputComponent } from './input/input.component';
import { OpsMxButtonComponent } from './button/button.component';
import { OpsMxSelectComponent } from './select/select.component';
import { OpsMxHelptextComponent } from './helptext/helptext.component';
import { OpsMxFormFieldComponent } from './form-field/form-field.component';
import { OpsMxFormGridRowComponent } from './form-grid-row/form-grid-row.component';
import { OpsMxFormGridComponent } from './form-grid/form-grid.component';



@NgModule({
  declarations: [
    OpsMxInputComponent, 
    OpsMxButtonComponent,
    OpsMxSelectComponent,
    OpsMxHelptextComponent,
    OpsMxFormGridComponent,
    OpsMxFormGridRowComponent,
    OpsMxFormFieldComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    OpsMxInputComponent, 
    OpsMxButtonComponent,
    OpsMxSelectComponent,
    OpsMxHelptextComponent,
    OpsMxFormGridComponent
  ]
})
export class OpsMxFormsModule { }
