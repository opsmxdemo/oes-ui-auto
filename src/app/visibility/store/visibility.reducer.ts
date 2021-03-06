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
    gateInstanceDetails: any,
    gateInstanceDetailsLoading: boolean,
    visibilityData: any,
    approvalInstanceId: number,
    connectorType: string,
    visibilityDataLoaded: boolean,
    connectorTypeLoading: boolean
}

export const initialState: State = {
    errorMessage: null,
    applicationList: null,
    applicationListLoading: false,
    serviceList: null,
    serviceListLoading: true,
    applicationId: null,
    toolConnectors: null,
    gateInstanceDetails: null,
    gateInstanceDetailsLoading: false,
    visibilityData: null,
    approvalInstanceId: null,
    connectorType: null,
    visibilityDataLoaded: null,
    connectorTypeLoading: null
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
                applicationListLoading: false
            })
        ),
        on(Visibility.fetchApplications,
            (state, action) => ({
                ...state,
                applicationList: action.applicationList,
                applicationListLoading: true
            })
        ),
        on(Visibility.stopLoadingApplication,
            (state, action) => ({
                ...state,
                applicationListLoading: false
            })),
        on(Visibility.loadServices,
            (state, action) => ({
                ...state,
                applicationId: action.applicationId,
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
        on(Visibility.stopLoadingService,
            (state, action) => ({
                ...state,
                serviceListLoading: false
            })),
        on(Visibility.loadToolConnectors,
            (state, action) => ({
                ...state,
                id: action.id,
               connectorTypeLoading : false
            })
        ),
        on(Visibility.fetchToolConnectors,
            (state, action) => ({
                ...state,
                toolConnectors: action.toolConnectors,
               connectorTypeLoading : true
            })
        ),
        on(Visibility.stopLoadingConnectors,
            (state, action) => ({
                ...state,
               connectorTypeLoading : false
            })),
        on(Visibility.loadGateInstanceDetails,
            (state, action) => ({
                ...state,
                id: action.id,
                gateInstanceDetailsLoading: false
            })
        ),
        on(Visibility.fetchGateInstanceDetails,
            (state, action) => ({
                ...state,
                gateInstanceDetails: action.gateInstanceDetails,
                gateInstanceDetailsLoading: true,
            })
        ),
        on(Visibility.stopGateInstanceLoading,
            (state, action) => ({
                ...state,
               gateInstanceDetailsLoading : false
            })),
        on(Visibility.loadVisibilityData,
            (state, action) => ({
                ...state,
                visibilityDataLoaded : false
            })
        ),
        on(Visibility.fetchVisbilityData,
            (state, action) => ({
                ...state,
                visibilityData: action.visibilityData,
                visibilityDataLoaded : true
            })
        ),
        on(Visibility.visibilityDataLoading,
            (state, action) => ({
                ...state,
               visibilityDataLoaded : false
            })),
        on(Visibility.postReview,
            (state,action) => ({
                ...state
            })
        ),
        on(Visibility.fetchComments,
            (state, action) => ({
                ...state,
                reviewComments: action.reviewComments
            })
        ),
    )(visibilityState, visibilityAction);
};

// export const selectDeploymentVerificationState = createSelector(selectFeatureState, (state) => state.deploymentVerification);
