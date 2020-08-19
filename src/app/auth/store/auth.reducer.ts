import * as AuthAction from './auth.actions';


export interface State {
    user: string;
    authenticated: boolean;
    authResponse: any;
    authError: string;
    loading: Boolean;
    token: string;
    autologinSucceed: Boolean;
}

export const initialState: State = {
    user: null,
    authError: null,
    loading: null,
    authenticated: false,
    authResponse: 'dummy',
    token: null,
    autologinSucceed: false
}

export function authReducer(
    state: State = initialState,
    action: AuthAction.AuthActions
) {
    
    switch (action.type) {
        case AuthAction.AuthActionTypes.LOGINFAIL:
            return {
                ...state,
                authError: action.payload,
                user: null,
                loading: false,
                authenticated: false
            }
        case AuthAction.AuthActionTypes.LOGINSTART:
            return {
                ...state,
                authError: null,
                loading: true,
                authenticated: false
            }
        case AuthAction.AuthActionTypes.LOGIN:
            return {
                ...state,
                user: action.payload.username,
                token: action.payload.token,
                loading: false,
                authError: null,
                authenticated: true
            }
        case AuthAction.AuthActionTypes.LOGOUT:
            return {
                ...state,
                authError: null,
                authenticated:false
            }
        case AuthAction.AuthActionTypes.AUTOLOGIN:
            return {
                ...state,
                user: action.payload.username,
                token: action.payload.token,
                loading: false,
                authError: null,
                authenticated: true,
                autologinSucceed: true
            }
        case AuthAction.AuthActionTypes.AUTOLOGINFAIL:
            return {
                ...state,
                loading: false,
                authError: null,
                authenticated: false,
                autologinSucceed: true
            }
        default:
            return state;
    }

}