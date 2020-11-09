import { loadLogTopics } from './../../../../application-onboarding/application/store/application.actions';
import { Action, createReducer, on } from '@ngrx/store';
import * as LogAnalysisActions from './log-analysis.actions';
import { Observable } from 'rxjs';
//import { User } from '../deployment-verification.component';

export interface State {
    logsResults: any;
    errorMessage: string;
    deployementLoading: boolean;
    logsEventResults: any;
    clusterLogs:any;
    timeStampData:any;
    rerunResponse:any;
    reclassificationHistoryResults:any;
    fetchLogTopics: any;  
    isLogsResultsLoaded : boolean;  
    isLogsEventsLoaded : boolean;
    isLoadedRerunResults : boolean;
    isLoadedClusterLogData : boolean;
    logTopicsList:any;
}

export const initialState: State = {
    logsResults: null,
    errorMessage: null,
    deployementLoading: false,
    logsEventResults : null,
    clusterLogs: null,
    timeStampData:null,
    rerunResponse:null,
    reclassificationHistoryResults:null,
    fetchLogTopics: null,
    isLogsResultsLoaded : false,
    isLogsEventsLoaded: false,
    isLoadedRerunResults:false,
    isLoadedClusterLogData :false,
    logTopicsList:null,
}

export function LogAnalysisReducer(
    logAnalysisState: State | undefined,
    logAnalysisAction: Action) {
    return createReducer(
        initialState,
        on(LogAnalysisActions.loadLogResults,
            (state,action) => ({
                ...state,
                isLogsResultsLoaded: false,
                canaryId: action.canaryId,
                serviceId: action.serviceId
            })
        ),
        on(LogAnalysisActions.fetchLogsResults,
            (state, action) => ({
                ...state,
                logsResults: action.logsResults,
                isLogsResultsLoaded: true
            })
        ),
        on(LogAnalysisActions.loadedLogResults,
            (state,action) => ({
                ...state,
                isLogsResultsLoaded: false
            })
        ),
        on(LogAnalysisActions.loadEventLogResults,
            (state,action) => ({
                ...state,
                isLogsEventsLoaded : false,
                canaryId: action.canaryId,
                serviceId: action.serviceId,
                event : action.event
            })
        ),                
        on(LogAnalysisActions.fetchEventLogsResults,
            (state, action) => ({
                ...state,
                logsEventResults: action.logsEventResults,
                isLogsEventsLoaded: true
            })
        ),        
        on(LogAnalysisActions.loadedEventsLogs,
            (state,action) => ({
                ...state,
                isLogsEventsLoaded: false
            })
        ),
        on(LogAnalysisActions.rerunLogs,
            (state,action) => ({
                ...state,
                isLoadedRerunResults: false,
                canaryId: action.canaryId,
                serviceId: action.serviceId,
                logTemplate : action.logTemplate
            })
        ),
        on(LogAnalysisActions.fetchRerunLogsResults,
            (state, action) => ({
                ...state,
                rerunResponse: action.rerunResponse,
                isLoadedRerunResults: true
            })
        ),
        on(LogAnalysisActions.loadedRerunResults,
            (state,action) => ({
                ...state,
                isLoadedRerunResults: false
            })
        ),
        on(LogAnalysisActions.fetchClusterLogData,
            (state,action) => ({
                ...state,
                isLoadedClusterLogData: false,
                canaryId: action.canaryId,
                serviceId: action.serviceId,
                clusterId : action.clusterId,
                version : action.version
            })
        ),
        on(LogAnalysisActions.loadClusterLogData,
            (state, action) => ({
                ...state,
                clusterLogs: action.clusterLogs,
                isLoadedClusterLogData: true
            })
        ),
        on(LogAnalysisActions.loadedClusterLogData,
            (state,action) => ({
                ...state,
                isLoadedClusterLogData: false
            })
        ),
         on(LogAnalysisActions.loadLogTopics,
            state => ({
                ...state,
                logListLoading: true
            })
        ),
        on(LogAnalysisActions.fetchLogTopics,
            (state, action) => ({
                ...state,
                logTopicsList: action.logslist,
                logListLoading: false
            })
        ),
        on(LogAnalysisActions.loadTimeAnalysisGraphData,
            (state, action) => ({
                ...state,
                timeStampData:action.logTimeAnalysisResults,
                deployementLoading: false
            })
        )
    )(logAnalysisState,logAnalysisAction);
}
