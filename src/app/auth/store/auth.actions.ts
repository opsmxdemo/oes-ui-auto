import { Action } from '@ngrx/store';


export enum AuthActionTypes {
    LOGINSTART = '[Auth] LoginStart',
    LOGIN = '[Auth] Login',
    LOGINFAIL = '[Auth] LoginFail',
    SIGNUP = '[Auth] SignUp',
    SIGNUPSTART = '[Auth] SignUpStart',
    LOGOUT = '[Auth] Logout',
    AUTOLOGINSTART = '[Auth] AutoLoginStart',
    AUTOLOGIN = '[Auth] AutoLogin'
}


export class LoginFail implements Action {
    readonly type = AuthActionTypes.LOGINFAIL;
    constructor(public payload: string) { }
}

export class LoginStart implements Action {
    readonly type = AuthActionTypes.LOGINSTART;
    constructor(public payload: {
        userName: string,
        password: string
    }) { }
}

export class Login implements Action {
    readonly type = AuthActionTypes.LOGIN;
    constructor(public payload: any) { }
}

export class SignUpStart implements Action {
    readonly type = AuthActionTypes.SIGNUPSTART;
    constructor(public payload: { fullName: string, emailId: string, userName: string, password: String }) { }
}

export class SignUp implements Action {
    readonly type = AuthActionTypes.SIGNUP;
    constructor(public payload: any) { }
}

export class Logout implements Action {
    readonly type = AuthActionTypes.LOGOUT;
}

export class AutoLoginStart implements Action {
    readonly type = AuthActionTypes.AUTOLOGINSTART;
}

export class AutoLogin implements Action {
    readonly type = AuthActionTypes.AUTOLOGIN;
    constructor(public payload: any) { }
}



export type AuthActions = LoginFail |
    LoginStart |
    Login |
    SignUpStart |
    SignUp |
    Logout |
    AutoLogin |
    AutoLoginStart;