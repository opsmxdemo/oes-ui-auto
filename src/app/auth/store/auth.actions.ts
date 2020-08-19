import { Action } from '@ngrx/store';


export enum AuthActionTypes {

    LOGINSTART = '[Auth] LoginStart',
    LOGIN = '[Auth] Login',
    LOGINFAIL = '[Auth] LoginFail',
    AUTHENTICATIONSUCCESS = '[Auth] AuthenticationSuccess',
    LOGINRESPONSE = '[Auth] LoginResponse',
    LOGOUT = '[Auth] Logout',
    AUTOLOGINSTART = '[Auth] AutoLoginStart',
    AUTOLOGIN = '[Auth] AutoLogin',
    AUTOLOGINFAIL = '[Auth] AutoLoginFail'
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
    constructor(public payload:{
        username:string,
        token:string
    }) {}
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

export class AutoLoginStart implements Action {
    readonly type = AuthActionTypes.AUTOLOGINSTART;
}

export class AutoLogin implements Action {
    readonly type = AuthActionTypes.AUTOLOGIN;
    constructor(public payload:{
        username:any,
        token:any
    }) { }
}

export class AutoLoginFail implements Action {
    readonly type = AuthActionTypes.AUTOLOGINFAIL;
}



export type AuthActions = LoginFail
                        | Login
                        | LoginStart 
                        | LoginResponse
                        | AuthenticationSuccess
                        | Logout
                        | AutoLogin 
                        | AutoLoginStart
                        | AutoLoginFail;