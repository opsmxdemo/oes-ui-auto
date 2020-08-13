import { Action } from '@ngrx/store';


export enum AuthActionTypes {

    LOGINSTART = '[Auth] LoginStart',
    LOGIN = '[Auth] Login',
    LOGINFAIL = '[Auth] LoginFail',
    AUTHENTICATIONSUCCESS = '[Auth] AuthenticationSuccess',
    LOGINRESPONSE = '[Auth] LoginResponse',
    LOGOUT = '[Auth] Logout'
}


export class LoginFail implements Action{
    readonly type = AuthActionTypes.LOGINFAIL;
    constructor(public payload:string){}
}

export class LoginStart implements Action{
    readonly type = AuthActionTypes.LOGINSTART;
    constructor(public payload:{
        username:string,
        password:string
    }) {}
}

export class Login implements Action{
    readonly type = AuthActionTypes.LOGIN;
    constructor(public payload: string) {}
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



export type AuthActions = LoginFail
                        | Login
                        | LoginStart 
                        | LoginResponse
                        | AuthenticationSuccess
                        | Logout;