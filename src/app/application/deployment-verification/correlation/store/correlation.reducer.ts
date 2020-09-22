
import { Action, createReducer, on } from '@ngrx/store';
import * as CorrelationActions from './correlation.actions';
import { Observable } from 'rxjs';
//import { User } from '../deployment-verification.component';

export interface State {
    unexpectedClusters: any;
      
}

export const initialState: State = {
    unexpectedClusters: null,

}

export function CorrelationReducer(
    CorrelationState: State | undefined,
    CorrelationActions: Action) {
    return createReducer(
        initialState,
        on(CorrelationActions.loadUnxepectedClusters,
            (state,action) => ({
                ...state,
                deployementLoading: true,
                unexpectedClusters: action.unexpectedClusters,
                
            })
        ),
        on(CorrelationActions.loadLogLines,
            (state, action) => ({
                ...state,
                deployementLoading: true,
                logLines: action.logLines,
            })
        )
    )(CorrelationState,CorrelationActions);
}
