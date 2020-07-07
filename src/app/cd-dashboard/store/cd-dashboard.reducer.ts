import { Action, createReducer, on } from '@ngrx/store';
import * as CdDashboardActions from './cd-dashboard.actions'

export interface State {
    healthChartData: any;
    errorMessage: string;
    widgetRawData: any;
    subChartData: [];
    subChartLoading: [];
}

export const initialState: State = {
    healthChartData: null,
    errorMessage: null,
    widgetRawData: null,
    subChartData: null,
    subChartLoading: null
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
                widgetRawData:action.widgetRawData
            })
        ),
        on(CdDashboardActions.errorOccured,
            (state, action) => ({
                ...state,
                errorMessage: action.errorMessage
            })
        ),
        // on(CdDashboardActions.loadSubChartData,
        //     (state, action) => ({
        //         ...state,
        //         subChartLoading: [...state.subChartLoading,false]
        //     })
        // ),
        
    )(dashboardState,dashboardActions);
}