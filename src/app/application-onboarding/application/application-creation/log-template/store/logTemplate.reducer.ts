
import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationAction from '../../../store/application.actions';
//import { Action } from 'rxjs/internal/scheduler/Action';



export interface State {

    // Log Template variables 
    logListLoading: boolean;
    logTopicsList: [];
    logClusterLoading: boolean;
    logClusterTags: [];
    logAccountsData: any,
    callGetLogAccountsAPI: boolean;
    logDataSourcesLoading: boolean;
    logDataSources: [];
    accountName: any;
    isloadedResponseKey:boolean;
    responseKeys:any;
}

export const initialState: State = {
    logAccountsData: null,
    callGetLogAccountsAPI: true,
    logListLoading: false,
    logTopicsList: null,
    logClusterLoading: false,
    logClusterTags: null,
    logDataSources: null,
    logDataSourcesLoading: false,
    accountName: null,
    isloadedResponseKey:false,
    responseKeys:null
}

export function LogTemplateReducer(
    logTemplateState: State | undefined,
    logTemplateAction: Action) {
    return createReducer(
        initialState,
       // ###  LogTemplate screen logic start ### // 

      
        on(ApplicationAction.loadMonitoringAccountName,
            (state,action) => ({
                ...state,
                callGetLogAccountsAPI: false
            })
        ),
        on(ApplicationAction.fetchMonitoringAccounts,
            (state,action) => ({
                ...state,
                logAccountsData: action.logAccounts
            })
        ),
        on(ApplicationAction.loadLogTopics,
            state => ({
                ...state,
                logListLoading:true
            })
        ),
        on(ApplicationAction.fetchLogTopics,
            (state,action) => ({
                ...state,
                logTopicsList: action.logslist,
                logListLoading:false
            })
        ),
        on(ApplicationAction.loadClusterTags,
            state => ({
                ...state,
                logClusterLoading:true
            })
        ),
        on(ApplicationAction.fetchClusterTags,
            (state,action) => ({
                ...state,
                logClusterTags: action.clusterTags,
                logClusterLoading:false
            })
        ),
        on(ApplicationAction.loadSupportingDatasources,
            state => ({
                ...state,
                logDataSourcesLoading:true
            })
        ),
        on(ApplicationAction.fetchDatasources,
            (state,action) => ({
                ...state,
                logDataSources: action.datasources,
                logDataSourcesLoading:false
            })
        ),
        on(ApplicationAction.loadDataSourceResponseKey,
            (state,action) => ({
                ...state,
                isloadedResponseKey:true,
                responseKeys : action.responseKeys
            })
        ),
        on(ApplicationAction.fetchDataSourceResponseKey,
            (state,action) => ({
                ...state,
                accountName: action.accountName,
                isloadedResponseKey:false
            })
        ),
        on(ApplicationAction.loadedDataSourceResponseKey,
            (state) => ({
                ...state,                
                isloadedResponseKey:false
            })
        ),

        // ###  LogTemplate screen logic start ### // 

    )(logTemplateState,logTemplateAction);
}