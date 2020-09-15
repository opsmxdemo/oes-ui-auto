
import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationAction from '../../../store/application.actions';



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

        // ###  LogTemplate screen logic start ### // 

    )(logTemplateState,logTemplateAction);
}