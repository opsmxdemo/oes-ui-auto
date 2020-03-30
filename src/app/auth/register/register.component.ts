import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthAction from '../store/auth.actions';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.less'],
    animations: [
        trigger('registeranimation', [
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
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading:Boolean;

    constructor(public store:Store<fromApp.AppState>) { }

    ngOnInit() {
        // defining reactive form approach
        this.registerForm = new FormGroup({
            fullName: new FormControl('', Validators.required),
            emailId: new FormControl('', [Validators.required, Validators.email]),
            userName: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            confirmpassword: new FormControl('', [Validators.required, this.passwordMatches.bind(this)])
        });

         //fetching value from Authstate
         this.store.select('auth').subscribe(
            (response) => {
                this.loading = response.loading
            }
          );
    }

    // custom valiadator for Confirm-password
    passwordMatches(control: FormControl): { [s: string]: boolean } {
        if (control.value !== '') {
            if (this.registerForm.value.password !== control.value) {
                return { mismatchVal: true };
            }
            return null;
        }
    }

    // below funcyion execute on click Signup btn
    onSubmitSignUp(){
        if(this.registerForm.valid){
            console.log('signup',this.registerForm.value);
            this.store.dispatch(new AuthAction.SignUpStart(this.registerForm.value))
        }
    }

}
