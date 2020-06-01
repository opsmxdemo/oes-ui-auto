import { Action, createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';

export interface State {
    appData: any;
    errorMessage: string;
    dashboardLoading: boolean;
}

export const initialState: State = {
    appData: null,
    errorMessage: null,
    dashboardLoading: false
}

export function DashboardReducer(
    dashboardState: State | undefined,
    dashboardActions: Action) {
    return createReducer(
        initialState,
        on(DashboardActions.loadAppDashboard,
            state => ({
                ...state,
                dashboardLoading: true
            })
        ),
        on(DashboardActions.fetchedAppData,
            (state, action) => ({
                ...state,
                appData: action.appData,
                dashboardLoading: false
            })
        ),
        on(DashboardActions.errorOccured,
            (state, action) => ({
                ...state,
                errorMessage: action.errorMessage,
                dashboardLoading: false
            })
        ),
    )(dashboardState,dashboardActions);
}