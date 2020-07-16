import { Action, createReducer, on } from '@ngrx/store';
import * as LogAnalysisActions from './log-analysis.actions';
import { Observable } from 'rxjs';
//import { User } from '../deployment-verification.component';

export interface State {
    logsResults: any;
    errorMessage: string;
    deployementLoading: boolean;
}

export const initialState: State = {
    logsResults: null,
    errorMessage: null,
    deployementLoading: false
}

export function LogAnalysisReducer(
    logAnalysisState: State | undefined,
    logAnalysisAction: Action) {
    return createReducer(
        initialState,
        on(LogAnalysisActions.loadLogResults,
            state => ({
                ...state,
                deployementLoading: true
            })
        ),
        on(LogAnalysisActions.fetchLogsResults,
            (state, action) => ({
                ...state,
                logsResults: action.logsResults,
                deployementLoading: false
            })
        )
    )(logAnalysisState,logAnalysisAction);
}