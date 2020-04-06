import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
    exports: [
        MatSliderModule,
        MatButtonModule
    ]
  })
export class AppMaterialModule { }
