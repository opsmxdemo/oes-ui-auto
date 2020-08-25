import * as LayoutAction from './layout.actions';
import { Menu } from 'src/app/models/layoutModel/sidenavModel/menu.model';


export interface State {
    menu: Menu;
    appliactionData: number;
    sidebarVisible: string;
    installationMode: string;
    apiErrorCounter: number[];
    errorMessage: string;
}

export const initialState: State = {
    menu: null,
    appliactionData: 0,
    sidebarVisible: '',
    installationMode:'',
    apiErrorCounter:[],
    errorMessage: ''
}

export function layoutReducer(
    state: State = initialState,
    action: LayoutAction.LayoutActions
) {
    switch (action.type) {
        case LayoutAction.LayoutActionTypes.LOADPAGE:
            return {
                ...state
            }
        case LayoutAction.LayoutActionTypes.SIDEBAR_FETCH:
            return {
                ...state,
                menu: action.payload,
                apiErrorCounter: []
            }
        case LayoutAction.LayoutActionTypes.APPLICATIONDATA:
            return {
                ...state,
                appliactionData: action.payload
            }
        case LayoutAction.LayoutActionTypes.SIDEBARTOGGLE:
            return {
                ...state,
                sidebarVisible: action.payload
            }
        case LayoutAction.LayoutActionTypes.INSTALLATIONMODE:
            return {
                ...state,
                installationMode: action.payload
            }
        case LayoutAction.LayoutActionTypes.SERVERERROR:
            return {
                ...state,
                apiErrorCounter: state.apiErrorCounter ,
                errorMessage: action.payload
            }
        default:
            return state;
    }
}