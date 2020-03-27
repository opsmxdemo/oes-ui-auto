import { Effect, ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthAction from '../store/auth.actions';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { of } from 'rxjs';

//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(new AuthAction.LoginFail(errorMessage));
    }
    switch (errorRes.error.message) {
        case 'Authentication Error':
            errorMessage = 'Invalid login credentials';
            break;
        case 'Email Exist':
            errorMessage = 'This email exist already';
            break;
    }
    return of(new AuthAction.LoginFail(errorMessage));
}

@Injectable()
export class AuthEffect {
    user: any;
    constructor(public actions$: Actions<AuthAction.AuthActions>,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router
    ) { }

    // Below effect is use for Login user
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthAction.AuthActionTypes.LOGINSTART),
        switchMap((authData: AuthAction.LoginStart) => {
            return this.http.post('https://35.238.22.177:8090/auth/login', { userName: authData.payload.userName, password: authData.payload.password }).pipe(
                map(resData => {
                    this.user = {
                        userName: authData.payload.userName,
                        token: resData
                    }
                    localStorage.setItem('userData', JSON.stringify(this.user));
                    return new AuthAction.Login(resData);
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    );

    // Below effect is use for Signup user
    @Effect()
    authSignUp = this.actions$.pipe(
        ofType(AuthAction.AuthActionTypes.SIGNUPSTART),
        switchMap((signUpData: AuthAction.SignUpStart) => {
            return this.http.post('https://35.238.22.177:8090/canaries/saveCanaryUserProfile', { fullNamw: signUpData.payload.fullName, userName: signUpData.payload.userName, emailId: signUpData.payload.emailId, password: signUpData.payload.password }).pipe(
                map(resData => {
                    return new AuthAction.SignUp(resData);
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    );

    //Below effect is use for auto-login functionality
    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthAction.AuthActionTypes.AUTOLOGINSTART),
        map(() => {
            const userData: {
                userName,
                token
            } = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return { type: 'DUMMY' };
            }

            const loadedUser = {
                userName: userData.userName,
                token: userData.token
            };

            if (loadedUser.token !== null) {
                return new AuthAction.AutoLogin(loadedUser.token);
            }

            return { type: 'DUMMY' };
        })
    )

    //Below effect is use to redirect Url after successfull Signup and logout
    @Effect({ dispatch: false })
    authRedirectSignup = this.actions$.pipe(
        ofType(AuthAction.AuthActionTypes.SIGNUP),
        tap((resData: AuthAction.SignUp) => {
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
                title: resData.payload.status
            });
            this.router.navigate(['/login'])
        })
    )

    //Below effect is use to redirect Url after successfull Loged In
    @Effect({ dispatch: false })
    authRedirectLogedIn = this.actions$.pipe(
        ofType(AuthAction.AuthActionTypes.LOGIN),
        tap(() => {
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
            this.router.navigate(['/appdashboard'])
        })
    )

}
