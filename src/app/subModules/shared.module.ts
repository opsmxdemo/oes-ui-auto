import { NgModule } from '@angular/core';
import { LoadingScreenComponent } from '../loading-screen/loading-screen.component';
import { KeysPipe } from '../pipes/keys.pipe';


@NgModule({
    declarations: [
        LoadingScreenComponent,
        KeysPipe
    ],
    exports: [ 
        LoadingScreenComponent,
        KeysPipe
    ]
  })

export class SharedModule { }
