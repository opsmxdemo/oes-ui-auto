import { Action, createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';

export interface State {
    appData: any;
    errorMessage: string;
}

export const initialState: State = {
    appData: null,
    errorMessage: null
}

export function DashboardReducer(
    dashboardState: State | undefined,
    dashboardActions: Action) {
    return createReducer(
        initialState,
        on(DashboardActions.fetchedAppData,
            (state, action) => ({
                ...state,
                appData: action.appData
            })
        ),
        on(DashboardActions.errorOccured,
            (state, action) => ({
                ...state,
                errorMessage: action.errorMessage
            })
        ),
    )(dashboardState,dashboardActions);
}