import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path:'**', 
                redirectTo:'login'} 
        ])
    ],
    declarations: [],
    exports: [
        RouterModule
    ]
})
export class WildcardRoutingModule { }