import { Action, createReducer, on } from '@ngrx/store';
import * as LogAnalysisActions from './log-analysis.actions';
import { Observable } from 'rxjs';
//import { User } from '../deployment-verification.component';

export interface State {
    logsResults: any;
    errorMessage: string;
    deployementLoading: boolean;
    logsEventResults: any;
}

export const initialState: State = {
    logsResults: null,
    errorMessage: null,
    deployementLoading: false,
    logsEventResults : null
}

export function LogAnalysisReducer(
    logAnalysisState: State | undefined,
    logAnalysisAction: Action) {
    return createReducer(
        initialState,
        on(LogAnalysisActions.loadLogResults,
            (state,action) => ({
                ...state,
                deployementLoading: true,
                canaryId: action.canaryId,
                serviceId: action.serviceId
            })
        ),
        on(LogAnalysisActions.fetchLogsResults,
            (state, action) => ({
                ...state,
                logsResults: action.logsResults,
                deployementLoading: false
            })
        ),on(LogAnalysisActions.loadEventLogResults,
            (state,action) => ({
                ...state,
                deployementLoading: true,
                canaryId: action.canaryId,
                serviceId: action.serviceId,
                event : action.event
            })
        ),
        on(LogAnalysisActions.fetchEventLogsResults,
            (state, action) => ({
                ...state,
                logsEventResults: action.logsEventResults,
                deployementLoading: false
            })
        )
    )(logAnalysisState,logAnalysisAction);
}
