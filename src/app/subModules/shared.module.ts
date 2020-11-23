import { NgModule } from '@angular/core';
import { LoadingScreenComponent } from '../loading-screen/loading-screen.component';
import { KeysPipe, EllipsisPipe, RoundOff} from '../pipes/keys.pipe';
import { LowercaseDirective } from '../directive/lowerCase.directive';
import { CompLevelErrorListingComponent } from '../error-handling/component-error-listing/component-error-listing.component';
import { AppErrorListingComponent } from '../error-handling/app-error-listing/app-error-listing.component';



@NgModule({
    declarations: [
        LoadingScreenComponent,
        KeysPipe,
        LowercaseDirective,
        CompLevelErrorListingComponent,
        AppErrorListingComponent,
        EllipsisPipe,
        RoundOff
    ],
    exports: [ 
        LoadingScreenComponent,
        KeysPipe,
        LowercaseDirective,
        CompLevelErrorListingComponent,
        AppErrorListingComponent,
        EllipsisPipe,
        RoundOff
    ]
  })

export class SharedModule { }
