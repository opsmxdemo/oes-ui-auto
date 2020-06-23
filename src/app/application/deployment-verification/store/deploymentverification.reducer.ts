import { Action, createReducer, on } from '@ngrx/store';
import * as DeploymentActions from './deploymentverification.actions';
import { Observable } from 'rxjs';
import { User } from '../deployment-verification.component';

export interface State {
    canaryRun: any;
    errorMessage: string;
    deployementLoading: boolean;
    canaryId: any;
    // variables to store application details
    applicationList: User[];
    applicationListLoading: boolean;
    serviceList: [];
    serviceListLoading: boolean;
    applicationHealthDetails: [];
    applicationHealthDetailsLoading: boolean;
    serviceInformation: any;
    serviceInformationLoading: boolean;
}

export const initialState: State = {
    canaryRun: null,
    errorMessage: null,
    deployementLoading: false,
    applicationList: null,
    applicationListLoading: false,
    serviceList: null,
    serviceListLoading: false,
    canaryId: null,
    applicationHealthDetails: null,
    applicationHealthDetailsLoading: false,
    serviceInformation: null,
    serviceInformationLoading: false,
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
        on(DeploymentActions.loadApplications,
            state => ({
                ...state,
                applicationListLoading: true
            })
        ),
        on(DeploymentActions.fetchApplications,
            (state,action) => ({
                ...state,
                applicationList: action.applicationList,
                applicationListLoading:false
            })
        ),
        on(DeploymentActions.loadServices,
            (state,action) => ({
                ...state,
                canaryId: action.canaryId,
                serviceListLoading: true
            })
        ),
        on(DeploymentActions.fetchServices,
            (state,action) => ({
                ...state,
                serviceList: action.servicesList,
                serviceListLoading:false
            })
        ),
        on(DeploymentActions.loadApplicationHelath,
            (state,action) => ({
                ...state,
                canaryId: action.canaryId,
            })
        ),
        on(DeploymentActions.fetchApplicationHelath,
            (state,action) => ({
                ...state,
                applicationHealthDetails: action.applicationHealthDetails,
                applicationHealthDetailsLoading:false
            })
        ),
        on(DeploymentActions.loadServiceInformation,
            (state,action) => ({
                ...state,
                canaryId: action.canaryId,
                serviceId: action.serviceId,
            })
        ),
        on(DeploymentActions.fetchServiceInformation,
            (state,action) => ({
                ...state,
                serviceInformation: action.serviceSummary,
                serviceInformationLoading:false
            })
        ),
    )(deploymentVerificationState,deploymentVerificationdActions);
}