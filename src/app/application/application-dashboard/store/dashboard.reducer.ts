import { Action, createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';

export interface State {
    appData: any;
    errorMessage: string;
    dashboardLoading: boolean;
    topologyChartData: any;
}

export const initialState: State = {
    appData: null,
    errorMessage: null,
    dashboardLoading: false,
    topologyChartData: null

}

export function DashboardReducer(
    dashboardState: State | undefined,
    dashboardActions: Action) {
    return createReducer(
        initialState,
        on(DashboardActions.loadAppDashboard,
            (state,action )=> ({
                ...state,
                dashboardLoading: true,
                username: action.username
            })
        ),
        on(DashboardActions.fetchNetworkChartData,
            (state, action) => ({
                ...state,
                topologyChartData:action.networkChartData,
                dashboardLoading:false
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