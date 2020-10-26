import { Action, createReducer, on, createSelector } from '@ngrx/store';
import * as Visibility from './visibility.actions';
import { User } from '../visibility.component';
// import { Observable } from 'rxjs';
// import { User } from '../trend-analysis.component';

export interface State {
    errorMessage: string;
    // variables to store application details
    applicationList: User[];
    applicationListLoading: boolean;
    serviceList: [];
    serviceListLoading: boolean;
    applicationId: number;
    toolConnectors: [],
    visibilityData: any
}

export const initialState: State = {
    errorMessage: null,
    applicationList: null,
    applicationListLoading: false,
    serviceList: null,
    serviceListLoading: true,
    applicationId: null,
    toolConnectors: null,
    visibilityData: null
};

export function VisibilityReducer(
    visibilityState: State | undefined,
    visibilityAction: Action) {
    return createReducer(
        initialState,
        on(Visibility.errorOccured,
            (state, action) => ({
                ...state,
                errorMessage: action.errorMessage,
                deployementLoading: false
            })
        ),
        on(Visibility.loadApplications,
            state => ({
                ...state,
                applicationListLoading: true
            })
        ),
        on(Visibility.fetchApplications,
            (state, action) => ({
                ...state,
                applicationList: action.applicationList,
                applicationListLoading: false
            })
        ),
        on(Visibility.loadServices,
            (state, action) => ({
                ...state,
                serviceListLoading: false
            })
        ),
        on(Visibility.fetchServices,
            (state, action) => ({
                ...state,
                serviceList: action.servicesList,
                serviceListLoading: true
            })
        ),
        on(Visibility.loadToolConnectors,
            (state, action) => ({
                ...state,
            })
        ),
        on(Visibility.fetchToolConnectors,
            (state, action) => ({
                ...state,
                toolConnectors: action.toolConnectors
            })
        ),
        on(Visibility.loadVisibilityData,
            (state, action) => ({
                ...state,
            })
        ),
        on(Visibility.fetchVisbilityData,
            (state, action) => ({
                ...state,
                visibilityData: action.visibilityData
            })
        )
    )(visibilityState, visibilityAction);
};

// export const selectDeploymentVerificationState = createSelector(selectFeatureState, (state) => state.deploymentVerification);