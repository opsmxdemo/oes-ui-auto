import { Action, createReducer, on } from '@ngrx/store';
import * as MetricAnalysisActions from './metric-analysis.actions'

export interface State {
    canaryOutputData: any;
}

export const initialState: State = {
    canaryOutputData: null
}

export function MetricAnalysisReducer(
    metricAnalysisState: State | undefined,
    metricAnalysisActions: Action) {
    return createReducer(
        initialState,
        on(MetricAnalysisActions.fetchCanaryOutput,
            (state, action) => ({
                ...state,
                canaryOutputData:action.cararyData
            })
        )
    )(metricAnalysisState,metricAnalysisActions);
}