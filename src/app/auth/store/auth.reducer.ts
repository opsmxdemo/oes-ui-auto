import * as AuthAction from './auth.actions';


export interface State {
    user: any;
    authError: string;
    loading: Boolean;
    authenticated: boolean;
    samlResponse: any;
}

export const initialState: State = {
    user: null,
    authError: null,
    loading: null,
    authenticated: false,
    samlResponse:'dummy'
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
                user: action.payload,
                loading: false,
                authError: null,
                authenticated: true
            }
        case AuthAction.AuthActionTypes.SIGNUP:
            return {
                ...state,
                loading: false,
                authError: null,
                authenticated: false
            }
        case AuthAction.AuthActionTypes.SIGNUPSTART:
            return {
                ...state,
                loading: true,
                authError: null,
                authenticated: false
            }
        case AuthAction.AuthActionTypes.LOGOUT:
            return {
                ...state,
                authError: null,
                authenticated: false
            }
        case AuthAction.AuthActionTypes.AUTOLOGIN:
            return {
                ...state,
                user: action.payload,
                loading: false,
                authError: null,
                authenticated: true
            }
            case AuthAction.AuthActionTypes.SAMLLOGINRESPONSE:
                return {
                    ...state,
                    samlResponse: action.payload
                }  
        default:
            return state;
    }
}