import { Action, createReducer, on } from '@ngrx/store';
import * as CdDashboardActions from './cd-dashboard.actions'

export interface State {
    healthChartData: any;
    errorMessage: string;
    subChardRawData: any;
}

export const initialState: State = {
    healthChartData: null,
    errorMessage: null,
    subChardRawData: null
}

export function CdDashboardReducer(
    dashboardState: State | undefined,
    dashboardActions: Action) {
    return createReducer(
        initialState,
        on(CdDashboardActions.fetchHealthChartData,
            (state, action) => ({
                ...state,
                healthChartData:action.mainChartData
            })
        ),
        on(CdDashboardActions.fetchSubChartRawData,
            (state, action) => ({
                ...state,
                subChardRawData:action.subChartRawData
            })
        ),
        on(CdDashboardActions.errorOccured,
            (state, action) => ({
                ...state,
                errorMessage: action.errorMessage
            })
        ),
        
    )(dashboardState,dashboardActions);
}