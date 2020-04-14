import * as AuthAction from './auth.actions';


export interface State {
    user: string;
    authenticated: boolean;
    authResponse: any;
}

export const initialState: State = {
    user: null,
    authenticated: false,
    authResponse: 'dummy'
}

export function authReducer(
    state: State = initialState,
    action: AuthAction.AuthActions
) {
    switch (action.type) {

        case AuthAction.AuthActionTypes.LOGINRESPONSE:
            return {
                ...state,
                authResponse: action.payload
            }
        case AuthAction.AuthActionTypes.AUTHENTICATIONSUCCESS:
            return {
                ...state,
                user: action.payload,
                authenticated:true,
                authResponse:'dummy'
            }
            case AuthAction.AuthActionTypes.LOGOUT:
                return {
                    ...state,
                    authenticated:false,
                    authResponse:null
                }
        default:
            return state;
    }
}