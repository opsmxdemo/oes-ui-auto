import { Action, createReducer, on } from '@ngrx/store';
import * as CdDashboardActions from './cd-dashboard.actions'

export interface State {
    healthChartData: any;
    mainChartLoading: boolean;
    errorMessage: string;
    widgetRawData: any;
    subChartData: Object[];
    subChartLoading: boolean[];
    subDataFetched: boolean;
}

export const initialState: State = {
    healthChartData: null,
    mainChartLoading: true,
    errorMessage: null,
    widgetRawData: null,
    subChartData: null,
    subChartLoading: null,
    subDataFetched: false
}

export function CdDashboardReducer(
    dashboardState: State | undefined,
    dashboardActions: Action) {
    return createReducer(
        initialState,
        on(CdDashboardActions.loadCdDashboard,
            state => ({
                ...state,
                mainChartLoading:true
            })
        ),
        on(CdDashboardActions.loadHealthChartData,
            state => ({
                ...state,
                mainChartLoading:true
            })
        ),
        on(CdDashboardActions.fetchHealthChartData,
            (state, action) => ({
                ...state,
                healthChartData:action.mainChartData,
                mainChartLoading:false
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
        on(CdDashboardActions.setInitialArrayData,
            (state, action) => ({
                ...state,
                subChartLoading: action.initialSubChartLoading,
                subChartData: action.initialSubChartData
            })
        ),
        on(CdDashboardActions.loadSubChartData,
            (state,action) => ({
                ...state,
                subChartLoading: state.subChartLoading.map(
                    (sunChartLoading, index) => index === action.index ? true : sunChartLoading
                ),
                subChartData: state.subChartData.map(
                    (subchartData,index) => index === action.index ? {} : subchartData
                ),
                subDataFetched:true,
                currentIndex: action.index
            })
        ),
        on(CdDashboardActions.fetchSubChartData,
            (state,action) => ({
                
                ...state,
                subChartLoading: state.subChartLoading.map(
                    (sunChartLoading, index) => index === action.index ? false : sunChartLoading
                ),
                subChartData: state.subChartData.map(
                    (subchartData,index) => index === action.index ? action.subChartData : subchartData
                ),
                currentIndex: action.index
            })
        )
        
    )(dashboardState,dashboardActions);
}