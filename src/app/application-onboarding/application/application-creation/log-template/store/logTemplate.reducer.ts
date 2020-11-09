
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
    applicationId:any
    tags:any
    jsonData:any;
    savedTagResponse:any;
    tagId:any;
    jsonDataedit : any;
    editTagResponse:any;
    deleteTagResponse:any;
    isloadedlogTopicsData:any;
    
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
    isloadedlogTopicsData:false,
    responseKeys:null,
    applicationId:null,
    tags:null,
    jsonData:null,
    savedTagResponse:null,
    tagId:null,
    jsonDataedit : null,
    editTagResponse:null,
    deleteTagResponse:null,
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
                isloadedlogTopicsData:false,
                logListLoading:true
            })
        ),
        on(ApplicationAction.isLoadedLogTopics,
            state => ({
                ...state,
                isloadedlogTopicsData:false
            })
        ),
        on(ApplicationAction.fetchLogTopics,
            (state,action) => ({
                ...state,
                logTopicsList: action.logslist,
                logListLoading:false,
                isloadedlogTopicsData:true
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
        on(ApplicationAction.loadCustomTags,
            (state,action) => ({
                ...state,
                isloadedResponseKey:false,
                applicationId : action.applicationId
            })
        ),
        on(ApplicationAction.fetchCustomTags,
            (state,action) => ({
                ...state,
                tags: action.tags,
                isloadedResponseKey:true
            })
        ),
        on(ApplicationAction.addCustomTags,
            (state,action) => ({
                ...state,
                isloadedResponseKey:false,
                applicationId : action.applicationId,
                jsonData : action.newtagData

            })
        ),
        on(ApplicationAction.savedCustomTag,
            (state,action) => ({
                ...state,
                savedTagResponse: action.savedTagResponse,
                isloadedResponseKey:true
            })
        ),
        on(ApplicationAction.editCustomTags,
            (state,action) => ({
                ...state,
                isloadedResponseKey:false,
                applicationId : action.applicationId,
                tagId:action.tagId,
                jsonDataedit : action.edittagData

            })
        ),
        on(ApplicationAction.savededitCustomTag,
            (state,action) => ({
                ...state,
                editTagResponse: action.savedEditTagResponse,
                isloadedResponseKey:true
            })
        ),
        on(ApplicationAction.deleteCustomTags,
            (state,action) => ({
                ...state,
                isloadedResponseKey:false,
                applicationId : action.applicationId,
                tagId:action.tagId
            })
        ),
        on(ApplicationAction.fetchDeleteCustomTag,
            (state,action) => ({
                ...state,
                deleteTagResponse: action.deleteTagResponse,
                isloadedResponseKey:true
            })
        ),

        // ###  LogTemplate screen logic start ### // 

    )(logTemplateState,logTemplateAction);
}