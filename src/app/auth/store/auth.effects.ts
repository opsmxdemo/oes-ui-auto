import { Effect, ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap,catchError } from 'rxjs/operators';
import * as AuthAction from '../store/auth.actions';
import { AppConfigService } from 'src/app/services/app-config.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { of } from 'rxjs';

//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(new AuthAction.LoginFail(errorMessage));
    }
    return of(new AuthAction.LoginFail(errorRes.error.message));
}

@Injectable()
export class AuthEffect {
    user: any;
    constructor(public actions$: Actions<AuthAction.AuthActions>,
                public http: HttpClient,
                private environment: AppConfigService,
                public store: Store<fromApp.AppState>,
                public router: Router) { }
                
   
// Below effect is use for Login user
@Effect()
authLogin = this.actions$.pipe(
    ofType(AuthAction.AuthActionTypes.LOGINSTART),
    switchMap((authData: AuthAction.LoginStart) => {
        return this.http.post(this.environment.config.endPointUrl+'auth/login', { username: authData.payload.username, password: authData.payload.password }).pipe(
            map(resData => {
                localStorage.setItem('userId',resData['jwt']);
                return new AuthAction.Login(resData['jwt']);
            }),
            catchError(errorRes => {
                return handleError(errorRes);
            })
        );
    })
);
    

         //Below effect is use to redirect Url after successfull Loged In
      @Effect({dispatch:false})
      authRedirectLogedIn = this.actions$.pipe(
          ofType(AuthAction.AuthActionTypes.LOGIN),
          tap(()=>{
              // sweet alert tost message
           const Toast = Swal.mixin({
             toast: true,
             position: 'top',
             showConfirmButton: false,
             timer: 5000,
             timerProgressBar: true,
             onOpen: (toast) => {
               toast.addEventListener('mouseenter', Swal.stopTimer);
               toast.addEventListener('mouseleave', Swal.resumeTimer);
             }
           });
           Toast.fire({
               icon: 'success',
               title: 'You are logedIn successfully!!'
             });
              this.router.navigate(['/application'])
          })
      )

        //Below effect is use to redirect Url after successfull Signup and logout
    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthAction.AuthActionTypes.LOGOUT),
        tap((resData: AuthAction.Logout) => {
            // sweet alert tost message
            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
                onOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
            Toast.fire({
                icon: 'success',
            });
            this.router.navigate(['/login'])
        })
    )
 

}
