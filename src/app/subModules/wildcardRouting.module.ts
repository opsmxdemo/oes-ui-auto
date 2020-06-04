import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path:'**', 
                redirectTo:'application'} 
        ])
    ],
    declarations: [],
    exports: [
        RouterModule
    ]
})
export class WildcardRoutingModule { }