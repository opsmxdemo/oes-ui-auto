import { Action, createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';

export interface State {
    appData: any;
    errorMessage: string;
    dashboardLoading: boolean;
    topologyChartData: any;
    applicationDeleted: boolean;
}

export const initialState: State = {
    appData: null,
    errorMessage: null,
    dashboardLoading: false,
    topologyChartData: null,
    applicationDeleted: false,
    

}

export function DashboardReducer(
    dashboardState: State | undefined,
    dashboardActions: Action) {
    return createReducer(
        initialState,
        on(DashboardActions.loadAppDashboard,
            (state,action )=> ({
                ...state,
                dashboardLoading: true
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
                dashboardLoading: false,
                errorMessage:null
            })
        ),
        on(DashboardActions.errorOccured,
            (state, action) => ({
                ...state,
                errorMessage: action.errorMessage,
                dashboardLoading: false
            })
        ),
        on(DashboardActions.deleteApplication,
            (state, action) => ({
                ...state,
                applicationDeleted: false
            })
        ),
        on(DashboardActions.deleteApplication,
            (state,action) => ({
                ...state,
                appData: state.appData.filter((appData,index) => index !== action.index)
            })
        ),
    )(dashboardState,dashboardActions);
}