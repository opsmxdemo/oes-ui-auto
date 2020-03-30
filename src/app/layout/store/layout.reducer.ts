import * as LayoutAction from './layout.actions';
import { Menu } from 'src/app/models/layoutModel/sidenavModel/menu.model';


export interface State {
    menu: Menu;
}

export const initialState: State = {
    menu: null
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
                menu: action.payload
            }
        default:
            return state;
    }
}