import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path:'**', 
                redirectTo:'appdashboard'} 
        ])
    ],
    declarations: [],
    exports: [
        RouterModule
    ]
})
export class WildcardRoutingModule { }