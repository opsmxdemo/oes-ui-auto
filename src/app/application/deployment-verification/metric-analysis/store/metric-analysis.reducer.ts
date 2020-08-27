import { Action, createReducer, on } from '@ngrx/store';
import * as MetricAnalysisActions from './metric-analysis.actions'

export interface State {
    canaryOutputData: any;
    errorMessage: string;
}

export const initialState: State = {
    canaryOutputData: null,
    errorMessage: null
}

export function MetricAnalysisReducer(
    metricAnalysisState: State | undefined,
    metricAnalysisActions: Action) {
    return createReducer(
        initialState,
        on(MetricAnalysisActions.fetchCanaryOutput,
            (state, action) => ({
                ...state,
                canaryOutputData:action.cararyData,
                errorMessage: null
            })
        ),
        on(MetricAnalysisActions.errorOccured,
            (state, action) => ({
                ...state,
                errorMessage:action.errorMessage
            })
        )
    )(metricAnalysisState,metricAnalysisActions);
}