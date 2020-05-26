import { Effect, ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import * as AuthAction from '../store/auth.actions';
import {environment} from '../../../environments/environment'

@Injectable()
export class AuthEffect {
    user: any;
    constructor(public actions$: Actions<AuthAction.AuthActions>,
                public http: HttpClient) { }
   
       //Below effect is use to Suport backend login
       @Effect()
       authLogin = this.actions$.pipe(
           ofType(AuthAction.AuthActionTypes.LOGINSTART),
           switchMap(() => {
               return this.http.get(environment.endPointUrl+'auth/user', {observe: 'response'})
                .pipe(
                   map(resData => {
                       if(resData.body !== null){
                           this.user = resData.body;
                           return new AuthAction.AuthenticationSuccess(this.user.username);
                       }else{
                        return new AuthAction.LoginResponse(resData.body);
                       }
                       
                   })
               );
           })
       );

        //Below effect is use to logout from session
        @Effect()
        authLogout = this.actions$.pipe(
            ofType(AuthAction.AuthActionTypes.LOGOUT),
            switchMap(() => {
                return this.http.get(environment.endPointUrl+'auth/logout', {observe: 'response'})
                 .pipe(
                    map(resData => {
                        return new AuthAction.LoginStart();
                    })
                );
            })
        );
 

}
