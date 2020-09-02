import { Action } from '@ngrx/store';


export enum AuthActionTypes {

    LOGINSTART = '[Auth] LoginStart',
    AUTHENTICATIONSUCCESS = '[Auth] AuthenticationSuccess',
    LOGINRESPONSE = '[Auth] LoginResponse',
    LOGOUT = '[Auth] Logout'
}

export class LoginStart implements Action {
    readonly type = AuthActionTypes.LOGINSTART;
}

export class LoginResponse implements Action {
    readonly type = AuthActionTypes.LOGINRESPONSE;
    constructor(public payload: any){}
}

export class AuthenticationSuccess implements Action {
    readonly type = AuthActionTypes.AUTHENTICATIONSUCCESS;
    constructor(public payload: string){}
}

export class Logout implements Action {
    readonly type = AuthActionTypes.LOGOUT;
}



export type AuthActions = LoginStart 
                        | LoginResponse
                        | AuthenticationSuccess
                        | Logout;