import { Component, OnInit } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthAction from '../store/auth.actions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    animations: [
        trigger('loginanimation', [
            state('in', style({
                opacity: 1,
                transform: 'translateX(0px)'
            })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateY(350px)'
                }),
                animate(1000)
            ]),

        ]),
    ]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading:Boolean;

    

    constructor(
        public store:Store<fromApp.AppState>
    ) { }

    ngOnInit() {
        // defining reactive form approach
        this.loginForm = new FormGroup({
            userName: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });

        //fetching value from Authstate
        this.store.select('auth').subscribe(
            (response) => {
                this.loading = response.loading
            }
          );
    }

    //Below function execute when user click on login button
    onSubmit(){
        if (this.loginForm.valid) {
            console.log("login form Submit",this.loginForm.value);
            this.store.dispatch(new AuthAction.LoginStart(this.loginForm.value))
            
        }
        
    }

}
