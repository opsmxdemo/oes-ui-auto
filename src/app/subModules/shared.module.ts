import { NgModule } from '@angular/core';
import { LoadingScreenComponent } from '../loading-screen/loading-screen.component';
import { KeysPipe } from '../pipes/keys.pipe';
import { LowercaseDirective } from '../directive/lowerCase.directive';


@NgModule({
    declarations: [
        LoadingScreenComponent,
        KeysPipe,
        LowercaseDirective
    ],
    exports: [ 
        LoadingScreenComponent,
        KeysPipe,
        LowercaseDirective
    ]
  })

export class SharedModule { }
