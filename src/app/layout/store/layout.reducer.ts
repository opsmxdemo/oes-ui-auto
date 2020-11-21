import * as LayoutAction from './layout.actions';
import { Menu } from 'src/app/models/layoutModel/sidenavModel/menu.model';


export interface State {
    supportedFeatures: [];
    menu: Menu;
    appliactionData: number;
    sidebarVisible: string;
    usergroupRefresh: any;
    apiErrorCollection: boolean[];
    errorMessage: string;
    approvalInstalgateCount: any;
}

export const initialState: State = {
    supportedFeatures: null,
    menu: null,
    appliactionData: 0,
    sidebarVisible: '',
    usergroupRefresh: null,
    apiErrorCollection:[false,false],
    errorMessage: '',
    approvalInstalgateCount: 0
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
        case LayoutAction.LayoutActionTypes.SUPPORTEDFEATURES:
                return {
                    ...state,
                    supportedFeatures: action.payload
                }
        case LayoutAction.LayoutActionTypes.SIDEBAR_FETCH:
            return {
                ...state,
                menu: action.payload
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
    
        case LayoutAction.LayoutActionTypes.USERGROUPREFRESH:
            return {
                    ...state,
                    usergroupRefresh: action.payload
            }
        case LayoutAction.LayoutActionTypes.VISIBILITY:
                return {
                        ...state,
                        approvalInstalgateCount: action.payload
                }
        case LayoutAction.LayoutActionTypes.SERVERERROR:
            return {
                ...state,
                apiErrorCollection: state.apiErrorCollection.map((el,index) => index === action.payload.index ? true : el),
                errorMessage: action.payload.errorMessage
            }
        case LayoutAction.LayoutActionTypes.APISUCCESS:
            return {
                ...state,
                apiErrorCollection: state.apiErrorCollection.map((el,index) => index === action.payload ? false : el)
            }
        default:
            return state;
    }
}