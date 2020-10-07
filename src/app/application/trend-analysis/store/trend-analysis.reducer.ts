import { Action, createReducer, on, createSelector } from '@ngrx/store';
import * as TrendAnalysis from './trend-analysis.actions';
import { User } from '../trend-analysis.component';
// import { Observable } from 'rxjs';
// import { User } from '../trend-analysis.component';

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
    applicationAndServiceList: any;
    issuesLogsData: any;
    applicationId: number;
    startTime: any;
    endTime: any;
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
    applicationAndServiceList: null,
    issuesLogsData: null,
    applicationId: null,
    startTime: null,
    endTime: null
};

export function TrendAnalysisReducer(
    trendAnalysisState: State | undefined,
    trendAnalysisAction: Action) {
    return createReducer(
        initialState,
        on(TrendAnalysis.loadLatestRun,
            state => ({
                ...state,
                deployementLoading: true
            })
        ),
        on(TrendAnalysis.fetchLatestRun,
            (state, action) => ({
                ...state,
                canaryId: action.canaryId,
                deployementLoading: false
            })
        ),
        on(TrendAnalysis.errorOccured,
            (state, action) => ({
                ...state,
                errorMessage: action.errorMessage,
                deployementLoading: false
            })
        ),
        on(TrendAnalysis.loadApplications,
            state => ({
                ...state,
                applicationListLoading: true
            })
        ),
        on(TrendAnalysis.fetchApplications,
            (state, action) => ({
                ...state,
                applicationList: action.applicationList,
                applicationListLoading: false
            })
        ),
        on(TrendAnalysis.loadServices,
            (state, action) => ({
                ...state,
                canaryId: action.canaryId,
                serviceListLoading: false
            })
        ),
        on(TrendAnalysis.fetchServices,
            (state, action) => ({
                ...state,
                serviceList: action.servicesList,
                serviceListLoading: true
            })
        ),
        on(TrendAnalysis.restrictExecutionOfServices,
            (state, action) => ({
                ...state,
                serviceListLoading: false
            })
        ),
        // on(TrendAnalysis.loadApplicationHelath,
        //     (state, action) => ({
        //         ...state,
        //         canaryId: action.canaryId,
        //     })
        // ),
        // on(TrendAnalysis.fetchApplicationHelath,
        //     (state, action) => ({
        //         ...state,
        //         applicationHealthDetails: action.applicationHealthDetails,
        //         applicationHealthDetailsLoading: false
        //     })
        // ),
        on(TrendAnalysis.loadServiceInformation,
            (state, action) => ({
                ...state,
                canaryId: action.canaryId,
                serviceId: action.serviceId,
            })
        ),
        on(TrendAnalysis.fetchServiceInformation,
            (state, action) => ({
                ...state,
                serviceInformation: action.serviceSummary,
                serviceInformationLoading: false
            })
        ),
        on(TrendAnalysis.loadApplicationData,
            (state, action) => ({
                ...state,
                applicationId: action.applicationId,
                startTime: action.startTime,
                endTime: action.endTime
            })
        ),
        on(TrendAnalysis.fetchApplicationData,
            (state, action) => ({
                ...state,
                applicationAndServiceList: action.applicationAndServiceList,
            })
        ),
        on(TrendAnalysis.loadServiceTrendLogs,
            (state, action) => ({
                ...state,
                applicationId: action.applicationId,
                startTime: action.startTime,
                endTime: action.endTime,
                serviceId: action.serviceId
            })
        ),
        on(TrendAnalysis.fetchServiceTrendLogs,
            (state, action) => ({
                ...state,
                issuesLogsData: action.issuesLogsData,
            })
        ),
    )(trendAnalysisState, trendAnalysisAction);
};

// export const selectDeploymentVerificationState = createSelector(selectFeatureState, (state) => state.deploymentVerification);
