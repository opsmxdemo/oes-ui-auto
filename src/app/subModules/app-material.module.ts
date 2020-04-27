import { NgModule } from '@angular/core';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';


@NgModule({
    exports: [
      MatDatepickerModule,
      MatNativeDateModule,
      MatInputModule,
      MatButtonModule, 
      SatDatepickerModule, 
      SatNativeDateModule
    ]
  })
export class AppMaterialModule { }
