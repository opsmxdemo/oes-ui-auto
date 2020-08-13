import * as AuthAction from './auth.actions';


export interface State {
    user: string;
    authenticated: boolean;
    authResponse: any;
    authError: string;
    loading: Boolean;
    token: string;
}

export const initialState: State = {
    user: null,
    authError: null,
    loading: null,
    authenticated: false,
    authResponse: 'dummy',
    token: null,
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
                // user: action.payload.user,
                loading: false,
                authError: null,
                authenticated: true,
                token: action.payload,
            }
        case AuthAction.AuthActionTypes.LOGOUT:
            return {
                ...state,
                authError: null,
                authenticated:false
            }
        default:
            return state;
    }

}