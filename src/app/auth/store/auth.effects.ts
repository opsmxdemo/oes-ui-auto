import { Effect, ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap,catchError } from 'rxjs/operators';
import * as AuthAction from '../store/auth.actions';
import { AppConfigService } from 'src/app/services/app-config.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
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
                    this.user = {
                        username: authData.payload.username,
                        token: resData['jwt']
                    }
                    localStorage.setItem('userData', JSON.stringify(this.user));
                    return new AuthAction.Login(this.user);
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
            this.router.navigate(['/application'])
        })
    )

    //Below effect is use to redirect Url after successfull Signup and logout
    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthAction.AuthActionTypes.LOGOUT),
        tap((resData: AuthAction.Logout) => {
            this.router.navigate(['/login'])
        })
    )

    //Below effect is use for auto-login functionality
    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthAction.AuthActionTypes.AUTOLOGINSTART),
        map(() => {
            const userData: {
                username,
                token
            } = JSON.parse(localStorage.getItem('userData'));
            if (userData.token === null || userData.token === undefined) {
                return new AuthAction.AutoLoginFail();
            }

            const loadedUser = {
                username: userData.username,
                token: userData.token
            };

            if (loadedUser.token !== null) {
            return new AuthAction.AutoLogin(loadedUser);
            }

            return { type: 'DUMMY' };
        })
    )
 

}
