import { Action, createReducer, on } from '@ngrx/store';
import * as DeploymentActions from './deploymentverification.actions';

export interface State {
    canaryRun: any;
    errorMessage: string;
    deployementLoading: boolean;
}

export const initialState: State = {
    canaryRun: null,
    errorMessage: null,
    deployementLoading: false
}

export function DeploymentdReducer(
    deploymentVerificationState: State | undefined,
    deploymentVerificationdActions: Action) {
    return createReducer(
        initialState,
        on(DeploymentActions.loadLatestRun,
            state => ({
                ...state,
                deployementLoading: true
            })
        ),
        on(DeploymentActions.fetchLatestRun,
            (state, action) => ({
                ...state,
                canaryRun: action.canaryRun,
                deployementLoading: false
            })
        ),
        on(DeploymentActions.errorOccured,
            (state, action) => ({
                ...state,
                errorMessage: action.errorMessage,
                deployementLoading: false
            })
        ),
    )(deploymentVerificationState,deploymentVerificationdActions);
}