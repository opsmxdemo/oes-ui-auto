import { Pipeline } from '../../../models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationAction from './application.actions';
import { CreateApplication } from '../../../models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from '../../../models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from '../../../models/applicationOnboarding/applicationList/applicationList.model';


export interface State {

    // Create Application variable
    pipelineData: Pipeline;
    erroeMessage: string;
    editMode: boolean;
    parentPage: string;
    applicationData: CreateApplication;
    applicationLoading: boolean;
    cloudAccountExist: CloudAccount;
    imageSource: string[];
    dockerImageData:any;
    callDockerImageDataAPI: boolean;
    userGropsData: string[];
    userGroupsPermissions: [];
    initalOESDatacall: boolean;
    initalOESDataLoaded: string[];
    applicationId:string;


    // Application List variables
    applicationList: ApplicationList[];
    appListLoading: boolean;

    // Log Template variables 
      logtemplate: any[];
      logListLoading: boolean;
      logTopicsList: [];
      logClusterLoading: boolean;
      logClusterTags: [];
      logAccountsData: any,
      callGetLogAccountsAPI: boolean;
      logDataSourcesLoading: boolean;
      logDataSources: [];

     // Metric Template variables 
     metrictemplate: any[];
     customDSAccounts:any;
     datasource : any;
     InfraDSAccounts : any;
     APMDSAccounts:any;
     APMApplicationForAccounts:any;
     INFRACookbook :any;
     metricType: any;
     applicationName : any;
     templateName : any;
     sourceType:any;
     accountName :any;
     APMCookbook:any;

}

export const initialState: State = {
    pipelineData: null,
    erroeMessage: null,
    editMode: false,
    parentPage: '/setup/applications',
    applicationData: null,
    cloudAccountExist: null,
    applicationList: [],
    appListLoading: false,
    applicationLoading: false,
    imageSource: null,
    dockerImageData: null,
    callDockerImageDataAPI: true,
    userGropsData: null,
    userGroupsPermissions: null,
    initalOESDatacall: false,
    initalOESDataLoaded: ['dummy','dummy'],
    applicationId:null,
    logtemplate: [],
    logAccountsData: null,
    callGetLogAccountsAPI: true,
    logListLoading: false,
    logTopicsList: null,
    logClusterLoading: false,
    logClusterTags: null,
    logDataSources: null,
    logDataSourcesLoading: false,
    
    metrictemplate:[],
    customDSAccounts : null,
    datasource : null,
    InfraDSAccounts:null,
    APMDSAccounts:null,
    APMApplicationForAccounts:null,
    INFRACookbook:null,
    metricType: null,
    applicationName : null,
    templateName : null,
    sourceType:null,
    accountName :null,
    APMCookbook: null
}

export function ApplicationReducer(
    applicationState: State | undefined,
    applicationAction: Action) {
    return createReducer(
        initialState,
        // #### CreateApplication screen logic start ####
        on(ApplicationAction.loadApp,
            (state, action) => ({
                ...state,
                editMode:false,
                parentPage: action.page,
            })
        ),
        on(ApplicationAction.loadOESData,
            (state, action) => ({
                ...state,
                initalOESDatacall: true,
                initalOESDataLoaded: ['calling','calling'],
            })
        ),
        on(ApplicationAction.fetchPipeline,
            (state, action) => ({
                ...state,
                pipelineData: action.pipelineData,
                initalOESDataLoaded: state.initalOESDataLoaded.map((data,index)=> {
                    if(index == 1){
                        let status = 'success';
                        if(action.pipelineData.name !== undefined){
                            status = 'success';
                        }else{
                            status =  'error';
                        }
                        return status;
                    }else{
                        return data;
                    }
                })
            })
        ),
        on(ApplicationAction.fetchUserGrops,
            (state, action) => ({
                ...state,
                userGropsData: action.userGroupData
            })
        ),
        on(ApplicationAction.fetchUserGropsPermissions,
            (state, action) => ({
                ...state,
                userGroupsPermissions: action.userGroupPermissionsData
            })
        ),
        on(ApplicationAction.errorOccured,
            (state,action) => ({
                ...state,
                erroeMessage:action.errorMessage,
                appListLoading: false,
                applicationLoading: false
            })
        ),
        on(ApplicationAction.initialOESCallFail,
            (state,action) => ({
                ...state,
                erroeMessage:action.errorMessage,
                initalOESDataLoaded: state.initalOESDataLoaded.map((data,index)=> index===action.index?'error':data)
            })
        ),
        on(ApplicationAction.enableEditMode,
            (state,action) => ({
                ...state,
                editMode:action.editMode,
                parentPage: action.page,
                applicationLoading: true,
                applicationId:null
            })    
        ),
        
        on(ApplicationAction.fetchAppData,
            (state,action) => ({
                ...state,
                applicationData:action.appData,
                applicationLoading: false,
                applicationId:action.applicationId
            })
        ),
        on(ApplicationAction.disabledEditMode,
            state => ({
                ...state,
                editMode:false
            })
        ),
        on(ApplicationAction.createApplication,
            state => ({
                ...state,
                applicationLoading:true
            })
        ),
        on(ApplicationAction.updateApplication,
            state => ({
                ...state,
                applicationLoading:true
            })
        ),
        on(ApplicationAction.dataSaved,
            state => ({
                ...state,
                applicationLoading:false
            })
        ),
        on(ApplicationAction.fetchCloudAccount,
            (state,action) => ({
                ...state,
                cloudAccountExist:action.cloudAccount
            })
        ),
        on(ApplicationAction.fetchImageSource,
            (state,action) => ({
                ...state,
                imageSource:action.imageSource,
                initalOESDataLoaded: state.initalOESDataLoaded.map((data,index)=> {
                    if(index == 0){
                        let status;
                        if(action.imageSource.length > 0){
                            status = 'success';
                        }else{
                            status =  'error';
                        }
                        return status;
                    }else{
                        return data;
                    }
                })
            })
        ),
        on(ApplicationAction.loadDockerImageName,
            (state,action) => ({
                ...state,
                callDockerImageDataAPI: false
            })
        ),
        on(ApplicationAction.fetchDockerImageName,
            (state,action) => ({
                ...state,
                dockerImageData: action.dockerImageData
            }),
        
        ),
        
        // #### CreateApplication screen logic ends ####//

        // ###  Applist screen logic start ### // 
        on(ApplicationAction.loadAppList,
            state => ({
                ...state,
                appListLoading:true
            })
        ),
        on(ApplicationAction.fetchAppList,
            (state,action) => ({
                ...state,
                applicationList: action.Applist,
                appListLoading:false
            })
        ),
        on(ApplicationAction.appDelete,
            state => ({
                ...state,
                appListLoading:true
            })
        ),
        on(ApplicationAction.appDeletedSuccessfully,
            (state,action) => ({
                ...state,
                applicationList: state.applicationList.filter((applist,index) => index !== action.index),
                appListLoading:false
            })
        ),
        // ###  Applist screen logic End ### // 

        // ###  LogTemplate screen logic start ### // 

        on(ApplicationAction.createdLogTemplate,
            (state,action) => ({
                ...state,
                logtemplate: state.logtemplate.concat({ ...action.logTemplateData })
            })
        ),
        on(ApplicationAction.updatedLogTemplate,
            (state,action) => ({
                ...state,
                logtemplate: state.logtemplate.map((logtemplate, index) => index === action.index ? action.logTemplateData : logtemplate)
            })
        ),
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

        // ###  MeticTemplate screen logic start ### // 

        on(ApplicationAction.createdMetricTemplate,
            (state,action) => ({
                ...state,
                metrictemplate: state.metrictemplate.concat({ ...action.metricTemplateData })
            })
        ),
        on(ApplicationAction.updatedMetricTemplate,
            (state,action) => ({
                ...state,
                metrictemplate: state.metrictemplate.map((metrictemplate, index) => index === action.index ? action.metricTemplateData : metrictemplate)
            })
        ),
        on(ApplicationAction.fetchAccountForCustomDataSource,
            (state,action) => ({
                ...state,
                datasource: action.datasource
            })
        ),
        on(ApplicationAction.loadAccountForCustomDataSource,
            (state,action) => ({
                ...state,
                customDSAccounts: action.customDSAccounts
            })
        ),
        on(ApplicationAction.fetchAccountForAPMDataSource,
            (state,action) => ({
                ...state,
                datasource: action.datasource
            })
        ),
        on(ApplicationAction.loadAccountForAPMDataSource,
            (state,action) => ({
                ...state,
                APMDSAccounts: action.APMDSAccounts
            })
        ),
        on(ApplicationAction.fetchAccountForInfraDataSource,
            (state,action) => ({
                ...state,
                datasource: action.datasource
            })
        ),
        on(ApplicationAction.loadAccountForInfraDataSource,
            (state,action) => ({
                ...state,
                InfraDSAccounts: action.InfraDSAccounts
            })
        ),
        on(ApplicationAction.fetchApplicationForAPMAccounts,
            (state,action) => ({
                ...state,
                sourceType: action.sourceType,
                accountName : action.account
            })
        ),
        on(ApplicationAction.loadApplicationForAPMAccounts,
            (state,action) => ({
                ...state,
                APMApplicationForAccounts: action.APMApplicationForAccounts
            })
        ),
        on(ApplicationAction.fetchInfraGenerateCookbook,
            (state,action) => ({
                ...state,
                sourceType: action.sourceType,
                accountName : action.account,
                metricType:action.metricType,
                applicationName : action.applicationName,
                templateName : action.templateName
            })
        ),
        on(ApplicationAction.loadInfraGenerateCookbook,
            (state,action) => ({
                ...state,
                INFRACookbook: action.INFRACookbook
            })
        ),
        on(ApplicationAction.fetchAPMGenerateCookbook,
            (state,action) => ({
                ...state,
                sourceType: action.sourceType,
                accountName : action.account,
                metricType:action.metricType,
                applicationName : action.applicationName,
                templateName : action.templateName
            })
        ),
        on(ApplicationAction.loadAPMGenerateCookbook,
            (state,action) => ({
                ...state,
                APMCookbook: action.APMCookbook
            })
        ),

        // ###  MeticTemplate screen logic start ### // 

        // ###  Reseting template data for both metric and log ### // 

        on(ApplicationAction.resetTemplateData,
            (state,action) => ({
                ...state,
                metrictemplate: [],
                logtemplate: []
            })
        ),

        // ###  Reseting template data for both metric and log ### // 
    )(applicationState,applicationAction);
}