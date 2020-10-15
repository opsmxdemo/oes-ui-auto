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
    cancelRunningCanaryStatus: any;
    manualTriggerResponse: any;
    reclassificationHistoryResults:any;
    isloadedApplicationHealth:boolean;
}

export const initialState: State = {
    canaryRun: null,
    errorMessage: null,
    deployementLoading: false,
    applicationList: null,
    applicationListLoading: false,
    serviceList: null,
    serviceListLoading: true,
    canaryId: null,
    applicationHealthDetails: null,
    applicationHealthDetailsLoading: false,
    serviceInformation: null,
    serviceInformationLoading: false,
    cancelRunningCanaryStatus: null,
    manualTriggerResponse: null,
    reclassificationHistoryResults:null,
    isloadedApplicationHealth :false
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
                canaryId: action.canaryId,
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
                serviceListLoading: false
            })
        ),
        on(DeploymentActions.fetchServices,
            (state,action) => ({
                ...state,
                serviceList: action.servicesList,
                serviceListLoading:true
            })
        ),
        on(DeploymentActions.restrictExecutionOfServices,
            (state,action) => ({
                ...state,
                serviceListLoading: false
            })
        ),
        on(DeploymentActions.loadApplicationHelath,
            (state,action) => ({
                ...state,
                canaryId: action.canaryId,
                isloadedApplicationHealth : false
            })
        ),
        on(DeploymentActions.fetchApplicationHelath,
            (state,action) => ({
                ...state,
                applicationHealthDetails: action.applicationHealthDetails,
                applicationHealthDetailsLoading:false,
                isloadedApplicationHealth : true
            })
        ),
        on(DeploymentActions.loadedApplicationHealth,
            (state) => ({
                ...state,
                isloadedApplicationHealth: false
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
        on(DeploymentActions.updateCanaryRun,
            (state, action) => ({
                ...state,
                canaryId: action.canaryId,
            })
        ),
        on(DeploymentActions.loadcancelRunningCanary,
            (state,action) => ({
                ...state,
                deployementLoading: true,
                canaryId: action.canaryId
            })
        ), on(DeploymentActions.manualTriggerData,
            (state, action) => ({
                ...state, data: action.data,
            })
        ), on(DeploymentActions.fetchManualTriggerResults,
            (state, action) => ({
                ...state, 
                manualTriggerResponse: action.manualTriggerResponse,
                canaryId: action.manualTriggerResponse.canaryId,
            })
        ),
        on(DeploymentActions.fetchcancelRunningCanaryStatus,
            (state, action) => ({
                ...state,
                cancelRunningCanaryStatus: action.cancelRunningCanaryData,
                deployementLoading: false
            })
        ),
        on(DeploymentActions.loadReclassificationHistoryData,
            (state, action) => ({
                ...state,
                reclassificationHistoryResults:action.reclassificationHistoryResults,
                deployementLoading: false
            })
        )
    )(deploymentVerificationState,deploymentVerificationdActions);
}