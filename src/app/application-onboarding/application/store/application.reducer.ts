import { Pipeline } from '../../../models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationAction from './application.actions';
import { CreateApplication } from '../../../models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from '../../../models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from '../../../models/applicationOnboarding/applicationList/applicationList.model';
import { SaveApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/saveApplicationModel';
import { Environment } from 'src/app/models/applicationOnboarding/createApplicationModel/environmentModel/environment.model';
import { act } from '@ngrx/effects';


export interface State {

    // Create Application variable
    pipelineData: Pipeline;
    erroeMessage: string;
    editMode: boolean;
    parentPage: string;
    applicationData: CreateApplication;
    appSavedData: SaveApplication;
    appEnvionmentsData: Environment;
    getEnvironmentListData: any;
    imageSourceListData: any;
    isfetchImageSourceLoaded: boolean;
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
    supportedFeaturesData: any;

    //new app onboarding flow
    savedApplicationData : any;
    savedServiceData : any;

    // Application List variables
    applicationList: ApplicationList[];
    appListLoading: boolean;

    // Log Template variables 
    logtemplate: any[];

    // Metric Template variables 
    metrictemplate: any[];

    // Sapor config related variables
    saporConfigData : any;
    saporConfigSavedData : any;
    isSaporConfigSaved: boolean;
    deleteSaporConfigMessage : any;
    saporConfigList : any;
    environmentsListData: any;
    isSaporConfigLoaded: boolean;
    isSaporConfigUpdated: boolean;

    // group permissions
    groupPermissionsListData: any;
    isGroupPermissions: boolean;


    //Visibility 
    approvalGateSavedData : any;
    approvalGateData : any;
    isGateSaved : boolean;
    approvalGatesList : any;
    isApprovalGatesLoaded : boolean;
    isApprovalGateEdited : boolean;
    editApprovalGateMessage : any;
    gateDataToEdit : any;
    isApprovalGateDeleted : any;
    deleteApprovalGateMessage : any;
    isConfiguredToolConnectorLoaded : boolean;
    configuredToolConnectorTypes : any;
    connectorType : any;
    isAccountForToolTypeLoaded: boolean;
    accountsForToolType : any;
    isTemplateForToolTypeLoaded: boolean;
    isServiceDeleted: boolean;
    templatesForToolType : any;
    templateForToolTypeSavedData : any;
    isTemplateForTooltypeSaved: boolean;
    templateForToolTypeData : any;
    toolconnectorwithTemplateSavedData: any;
    isToolConnectorwithTemplateSaved: boolean;
    toolconnectorwithTemplateData : any;
    approvalGatesListOfaService: any;
    isApprovalGatesOfaServiceLoaded: boolean;
    isVisibilityFeatureSaved:boolean;
    visibilityFeatureSavedData : any;	
    configuredToolConnectorData: any;
    isToolConnectoreForaGateLoaded: boolean;
    deleteFeatureVisibilityMessage: any;
    isDeletedVisibilityFeature: boolean;
    serviceId : any;
    gateId : any;
	
    templateId: any;
    templateData: any;
    isTemplateDataForToolTypeLoaded: boolean;
    isTemplateDataForToolTypeUpdated: boolean;
    isServiceFeatureListLoaded: boolean;
    isEnviromentsLoaded: boolean;
    isGroupPermissionsLoaded: boolean;
    groupPermissionsGetListData: any;

    //Deployment Verification
    logTemplatesofaApplication: any;
    isLogTemplateforApplicationLoaded: boolean;
    deleteFeatureDeploymentVerificationMessage: any;
    isDeletedDeploymentVerificationFeature: boolean;
    metricTemplatesofaApplication: any;
    isMetricTemplateforApplicationLoaded: boolean;
    metricTemplateData : any;
    templatesForaService:any;
    isTemplatesForaServiceLoaded: boolean;
    logTemplateDetails:any;
    isLogTemplateDetailsLoaded: boolean;    
    templateName : any;
    metricTemplateDetails : any;
    isMetricTemplateDetailsLoaded : boolean;
}

export const initialState: State = {
    pipelineData: null,
    erroeMessage: null,
    editMode: false,
    parentPage: '/setup/applications',
    applicationData: null,
    appSavedData: null,
    appEnvionmentsData: null,
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
    savedApplicationData: null,
    savedServiceData : null,
    logtemplate: [],
    metrictemplate:[],
    supportedFeaturesData: null,
    approvalGateSavedData : null,
    approvalGateData : null,
    isGateSaved : false,
    approvalGatesList : null,
    isApprovalGatesLoaded : false,
    isApprovalGateEdited : false,
    editApprovalGateMessage : null,
    gateDataToEdit : null,
    isApprovalGateDeleted : false,
    deleteApprovalGateMessage : null,
    isConfiguredToolConnectorLoaded : false,
    configuredToolConnectorTypes : null,
    connectorType : null,
    isAccountForToolTypeLoaded: false,
    accountsForToolType : null,
    isTemplateForToolTypeLoaded: false,
    isServiceDeleted: false,
    templatesForToolType : null,
    templateForToolTypeSavedData : null,
    isTemplateForTooltypeSaved: false,
    templateForToolTypeData : null,
    toolconnectorwithTemplateSavedData: null,
    isToolConnectorwithTemplateSaved: false,
    toolconnectorwithTemplateData : null,
    approvalGatesListOfaService: null,
    isApprovalGatesOfaServiceLoaded: false,
    isVisibilityFeatureSaved : false,
    visibilityFeatureSavedData : null,
    configuredToolConnectorData: null,
    isToolConnectoreForaGateLoaded: false,
    deleteFeatureVisibilityMessage: null,
    isDeletedVisibilityFeature: false,
    serviceId : null,
    gateId : null,
    templateId: null,
    templateData: null,
    isTemplateDataForToolTypeLoaded:false,
    isTemplateDataForToolTypeUpdated:false,
    isServiceFeatureListLoaded:false,

    // Sapor config variables
    saporConfigData : null,
    saporConfigSavedData : null,
    isSaporConfigSaved: false,
    deleteSaporConfigMessage: null,
    saporConfigList: null,
    environmentsListData: null,
    isSaporConfigLoaded: false,
    isSaporConfigUpdated: false,
    getEnvironmentListData: null,
    isEnviromentsLoaded: false,
    groupPermissionsListData: null,
    isGroupPermissions: false,
    isGroupPermissionsLoaded: false,
    groupPermissionsGetListData: null,
    imageSourceListData: null,
    isfetchImageSourceLoaded: true,

     //Deployment Verification
     logTemplatesofaApplication: null,
     isLogTemplateforApplicationLoaded: false,    
     deleteFeatureDeploymentVerificationMessage: null,
     isDeletedDeploymentVerificationFeature: false,
     metricTemplatesofaApplication: null,
     isMetricTemplateforApplicationLoaded: false,
     metricTemplateData : null,
     templatesForaService: null,
     isTemplatesForaServiceLoaded: false,
     logTemplateDetails: null,
     isLogTemplateDetailsLoaded: false,
     templateName : null,
     metricTemplateDetails : null,
     isMetricTemplateDetailsLoaded : false

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
                        if(action.pipelineData['length'] > 0){
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
                applicationId:null,
                applicationData: null,
                appSavedData: null,
            })    
        ),
        
        on(ApplicationAction.fetchAppData,
            (state,action) => ({
                ...state,
                applicationData:action.appData,
              //  appSavedData: action.
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
        // new onboarding code changes goes from here
        on(ApplicationAction.saveApplication,
            state => ({
                ...state,
                applicationLoading:true
            })
        ),
        on(ApplicationAction.savedApplication,
            (state,action) => ({
                ...state,
                applicationLoading:true,
                savedApplicationData : action.savedApplicationResponse
            })
        ),        
        on(ApplicationAction.saveService,
            state => ({
                ...state,
                applicationLoading:true
            })
        ),
        on(ApplicationAction.savedService,
            (state,action) => ({
                ...state,
                applicationLoading:true,
                savedServiceData : action.savedServiceResponse
            })
        ),

        on(ApplicationAction.getImageSource,
            (state,action) => ({
                ...state,
                isfetchImageSourceLoaded:false,
                applicationId: action.applicationId,

            })
        ),
        on(ApplicationAction.loadImageSource,
            (state,action) => ({
                ...state,
                isfetchImageSourceLoaded: true,
                imageSourceListData:action.imageSourceListData,
            })
        ),
        on(ApplicationAction.isgetImageSourceLoaded,
            (state,action) => ({
                ...state,
                isfetchImageSourceLoaded: false
            })
        ),

        // code related to environments goes here

        on(ApplicationAction.saveEnvironments,
            state => ({
                ...state,
                isEnviromentsLoaded:true
            })
        ),

        on(ApplicationAction.getEnvironments,
            (state,action) => ({
                ...state,
                isEnviromentsLoaded: false
            })
        ),
        on(ApplicationAction.loadEnvironments,
            (state,action) => ({
                ...state,
                environmentsListData:action.environmentsListData,
                isEnviromentsLoaded: true
            })
        ),
        on(ApplicationAction.isgetEnvironmentsLoaded,
            (state,action) => ({
                ...state,
                isEnviromentsLoaded: false
            })
        ),

        on(ApplicationAction.updateEnvironments,
            (state,action) => ({
                ...state,
                applicationId: action.applicationId,
                environmentsListData:action.environmentsListData,
                isEnviromentsLoaded: false
            })
        ),
        on(ApplicationAction.postUpdateEnvironments,
            (state,action) => ({
                ...state,
                saporConfigData:action.environmentsListUpdatedData,
                isEnviromentsLoaded: true
            })
        ),
        on(ApplicationAction.isgetEnvironmentsUpdated,
            (state,action) => ({
                ...state,
                isEnviromentsLoaded: false
            })
        ),

        on(ApplicationAction.deleteEnvironments,
            state => ({
                ...state,
            })
        ),
        on(ApplicationAction.environmentdeletedSuccessfully,
            (state,action) => ({
                ...state,
              
            })
        ),

        // group permission related variables

        on(ApplicationAction.saveGroupPermissions,
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

        ////////
        on(ApplicationAction.getGroupPermissions,
            (state,action) => ({
                ...state,
                isGroupPermissionsLoaded: false
            })
        ),
        on(ApplicationAction.loadGroupPermissions,
            (state,action) => ({
                ...state,
                groupPermissionsGetListData:action.groupPermissionsListData,
                isGroupPermissionsLoaded: true
            })
        ),
        on(ApplicationAction.isgetGroupPermissionsLoaded,
            (state,action) => ({
                ...state,
                isGroupPermissionsLoaded: false
            })
        ),

        on(ApplicationAction.updateGroupPermissions,
            (state,action) => ({
                ...state,
                applicationId: action.applicationId,
                groupPermissionsListData:action.groupPermissionsListData,
                isGroupPermissionsLoaded: false
            })
        ),
        on(ApplicationAction.postGroupPermissions,
            (state,action) => ({
                ...state,
                groupPermissionsListData:action.groupPermissionsListUpdatedData,
                isGroupPermissionsLoaded: true
            })
        ),
        on(ApplicationAction.isgetGroupPermissionsLoaded,
            (state,action) => ({
                ...state,
                isGroupPermissionsLoaded: false
            })
        ),

        on(ApplicationAction.deleteGroupPermissions,
            state => ({
                ...state,
            })
        ),
        on(ApplicationAction.groupPermissiondeletedSuccessfully,
            (state,action) => ({
                ...state,
              
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
                dockerImageData: action.dockerImageData,
                //callDockerImageDataAPI: true

            }),
        
        ),
        // on(ApplicationAction.isFetchDockerImageDataUpdated,
        //     (state,action) => ({
        //         ...state,
        //         callDockerImageDataAPI: false

        //     }),
        
        // ),
        on(ApplicationAction.fetchSupportedFeatures,
            (state,action) => ({
                ...state,
                supportedFeaturesData: action.supportedFeaturesData
            }),
        
        ),
        // Visibility Feature  Start here //
        on(ApplicationAction.saveApprovalGate,
            (state,action) => ({
                ...state,
                approvalGateData:action.approvalGateData,
                isGateSaved: false
            })
        ),
        on(ApplicationAction.postSaveApprovalGate,
            (state,action) => ({
                ...state,
                approvalGateSavedData:action.approvalGateSavedData,
                isGateSaved: true
            })
        ),
        on(ApplicationAction.isApprovalGateSaved,
            (state,action) => ({
                ...state,
                isGateSaved: false
            })
        ),

        on(ApplicationAction.getApprovalGates,
            (state,action) => ({
                ...state,
                isApprovalGatesLoaded: false
            })
        ),
        on(ApplicationAction.loadApprovalGates,
            (state,action) => ({
                ...state,
                approvalGatesList:action.approvalGatesList,
                isApprovalGatesLoaded: true
            })
        ),
        on(ApplicationAction.isApprovalGatesLoaded,
            (state,action) => ({
                ...state,
                isApprovalGatesLoaded: false
            })
        ),

        on(ApplicationAction.editApprovalGate,
            (state,action) => ({
                ...state,
                isApprovalGateEdited: false,
                gateId : action.gateId,
                gateDataToEdit : action.gateDataToEdit
            })
        ),
        on(ApplicationAction.postEditApprovalGate,
            (state,action) => ({
                ...state,
                editApprovalGateMessage:action.message,
                isApprovalGateEdited: true
            })
        ),
        on(ApplicationAction.isApprovalGateEdited,
            (state,action) => ({
                ...state,
                isApprovalGateEdited: false
            })
        ),

        on(ApplicationAction.deleteApprovalGate,
            (state,action) => ({
                ...state,
                isApprovalGateDeleted: false
            })
        ),
        on(ApplicationAction.postDeleteApprovalGate,
            (state,action) => ({
                ...state,
                deleteApprovalGateMessage:action.message,
                isApprovalGateDeleted: true
            })
        ),
        on(ApplicationAction.isApprovalGatesDeleted,
            (state,action) => ({
                ...state,
                isApprovalGateDeleted: false
            })
        ),

        on(ApplicationAction.getApprovalGatesOfaService,
            (state,action) => ({
                ...state,
                isApprovalGatesOfaServiceLoaded: false
            })
        ),
        on(ApplicationAction.loadApprovalGatesOfaService,
            (state,action) => ({
                ...state,
                approvalGatesListOfaService:action.approvalGatesListOfaService,
                isApprovalGatesOfaServiceLoaded: true
            })
        ),
        on(ApplicationAction.isApprovalGatesOfaServiceLoaded,
            (state,action) => ({
                ...state,
                isApprovalGatesOfaServiceLoaded: false
            })
        ),

        on(ApplicationAction.getConfiguredToolConnectorTypes,
            (state,action) => ({
                ...state,
                isConfiguredToolConnectorLoaded: false
            })
        ),
        on(ApplicationAction.loadConfiguredToolConnectorTypes,
            (state,action) => ({
                ...state,
                configuredToolConnectorTypes:action.configuredToolConnectorTypes,
                isConfiguredToolConnectorLoaded: true
            })
        ),
        on(ApplicationAction.isloadedConfiguredToolConnectorTypes,
            (state,action) => ({
                ...state,
                isConfiguredToolConnectorLoaded: false
            })
        ),

        on(ApplicationAction.getAccountToolType,
            (state,action) => ({
                ...state,
                connectorType : action.connectorType,
                isAccountForToolTypeLoaded: false
            })
        ),
        on(ApplicationAction.loadAccountToolType,
            (state,action) => ({
                ...state,
                accountsForToolType:action.accountsForToolType,
                isAccountForToolTypeLoaded: true
            })
        ),
        on(ApplicationAction.isLoadedAccountToolType,
            (state,action) => ({
                ...state,
                isAccountForToolTypeLoaded: false
            })
        ),

        on(ApplicationAction.getTemplatesToolType,
            (state,action) => ({
                ...state,
                connectorType : action.connectorType,
                isTemplateForToolTypeLoaded: false
            })
        ),
        on(ApplicationAction.loadTemplateToolType,
            (state,action) => ({
                ...state,
                templatesForToolType:action.templatesForToolType,
                isTemplateForToolTypeLoaded: true
            })
        ),
        on(ApplicationAction.isLoadedTemplateToolType,
            (state,action) => ({
                ...state,
                isTemplateForToolTypeLoaded: false
            })
        ),

        on(ApplicationAction.deleteService,
            (state,action) => ({
                ...state,
                applicationId : action.applicationId,
                serviceId: action.serviceId,
                isServiceDeleted: false
            })
        ),
        on(ApplicationAction.postDeleteService,
            (state,action) => ({
                ...state,
                deleteServiceMessage:action.deleteServiceMessage,
                isServiceDeleted: true
            })
        ),
        on(ApplicationAction.isDeleteService,
            (state,action) => ({
                ...state,
                isServiceDeleted: false
            })
        ),

        on(ApplicationAction.getTemplateDataForTooltype,
            (state,action) => ({
                ...state,
                templateId : action.templateId,
                isTemplateDataForToolTypeLoaded: false
            })
        ),
        on(ApplicationAction.loadTemplateDataForTooltype,
            (state,action) => ({
                ...state,
                templateData:action.templateData,
                isTemplateDataForToolTypeLoaded: true
            })
        ),
        on(ApplicationAction.isLoadedTemplateData,
            (state,action) => ({
                ...state,
                isTemplateDataForToolTypeLoaded: false
            })
        ),

        on(ApplicationAction.getFeaturesForAService,
            (state,action) => ({
                ...state,
                serviceId : action.serviceId,
                isServiceFeatureListLoaded: false
            })
        ),
        on(ApplicationAction.loadFetauresForService,
            (state,action) => ({
                ...state,
                serviceFeatureList:action.serviceFeatureList,
                isServiceFeatureListLoaded: true
            })
        ),
        on(ApplicationAction.isLoadedServiceFeatureList,
            (state,action) => ({
                ...state,
                isServiceFeatureListLoaded: false
            })
        ),

        on(ApplicationAction.updateTemplateForTooltype,
            (state,action) => ({
                ...state,
                updatedTemplateForToolTypeData : action.updatedTemplateForToolTypeData,
                isTemplateDataForToolTypeUpdated: false
            })
        ),
        on(ApplicationAction.putSaveTemplateForTooltype,
            (state,action) => ({
                ...state,
                templateForToolTypeSavedData:action.templateForToolTypeSavedData,
                isTemplateDataForToolTypeUpdated: true
            })
        ),
        on(ApplicationAction.isTemplateForTooltypeUpdated,
            (state,action) => ({
                ...state,
                isTemplateDataForToolTypeUpdated: false
            })
        ),

        on(ApplicationAction.saveTemplateForTooltype,
            (state,action) => ({
                ...state,
                templateForToolTypeData:action.templateForToolTypeData,
                isTemplateForTooltypeSaved: false
            })
        ),
        on(ApplicationAction.postSaveTemplateForTooltype,
            (state,action) => ({
                ...state,
                templateForToolTypeSavedData:action.templateForToolTypeSavedData,
                isTemplateForTooltypeSaved: true
            })
        ),
        on(ApplicationAction.isTemplateForTooltypeSaved,
            (state,action) => ({
                ...state,
                isTemplateForTooltypeSaved: false
            })
        ),

        on(ApplicationAction.saveToolConnectorWithTemplate,
            (state,action) => ({
                ...state,
                toolconnectorwithTemplateData:action.toolconnectorwithTemplateData,
                isToolConnectorwithTemplateSaved: false
            })
        ),
        on(ApplicationAction.postSaveToolConnectorWithTemplate,
            (state,action) => ({
                ...state,
                toolconnectorwithTemplateSavedData:action.toolconnectorwithTemplateSavedData,
                isToolConnectorwithTemplateSaved: true
            })
        ),
        on(ApplicationAction.isToolConnectorWithTemplateSaved,
            (state,action) => ({
                ...state,
                isToolConnectorwithTemplateSaved: false
            })
        ),
        on(ApplicationAction.saveVisibilityFeature,
            (state,action) => ({
                ...state,
                approvalGateData:action.approvalGateData,
                isVisibilityFeatureSaved: false
            })
        ),
        on(ApplicationAction.postSaveVisibilityFeature,
            (state,action) => ({
                ...state,
                visibilityFeatureSavedData:action.visibilityFeatureSavedData,
                isVisibilityFeatureSaved: true
            })
        ),
        on(ApplicationAction.isVisibilityFeatureSaved,
            (state,action) => ({
                ...state,
                isVisibilityFeatureSaved: false
            })
        ),

        on(ApplicationAction.getToolConnectorForaGate,
            (state,action) => ({
                ...state,
                gateId : action.gateId,
                isToolConnectoreForaGateLoaded: false
            })
        ),
        on(ApplicationAction.loadToolConnectorForaGate,
            (state,action) => ({
                ...state,
                configuredToolConnectorData:action.configuredToolConnectorData,
                isToolConnectoreForaGateLoaded: true
            })
        ),
        on(ApplicationAction.isLoadedToolConnectorForaGate,
            (state,action) => ({
                ...state,
                isToolConnectoreForaGateLoaded: false
            })
        ),

        on(ApplicationAction.deleteVisibilityFeature,
            (state,action) => ({
                ...state,
                gateId : action.gateId,
                serviceId : action.serviceId,
                isDeletedVisibilityFeature: false
            })
        ),
        on(ApplicationAction.postDeleteVisibilityFeature,
            (state,action) => ({
                ...state,
                deleteFeatureVisibilityMessage:action.deleteFeatureVisibilityMessage,
                isDeletedVisibilityFeature: true
            })
        ),
        on(ApplicationAction.isDeleteVisibilityFeature,
            (state,action) => ({
                ...state,
                isDeletedVisibilityFeature: false
            })
        ),
        // Visibility Feature  Ends here //


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

        // ###  MeticTemplate screen logic start ### // 

        // ###  Reseting template data for both metric and log ### // 

        on(ApplicationAction.resetTemplateData,
            (state,action) => ({
                ...state,
                metrictemplate: [],
                logtemplate: []
            })
        ),

        // Sapor config save code here
    on(ApplicationAction.saveSaporConfig,
        (state,action) => ({
            ...state,
            saporConfigData:action.saporConfigData,
            isSaporConfigSaved: false
        })
    ),
    on(ApplicationAction.postSaveSaporConfig,
        (state,action) => ({
            ...state,
            saporConfigData:action.saporConfigSavedData,
            isSaporConfigSaved: true
        })
    ),
    on(ApplicationAction.isSaporConfigSaved,
        (state,action) => ({
            ...state,
            isSaporConfigSaved: false
        })
    ),

    // update sapor
    on(ApplicationAction.updateSaporConfig,
        (state,action) => ({
            ...state,
            saporConfigData:action.saporConfigData,
            isSaporConfigUpdated: false
        })
    ),
    on(ApplicationAction.postUpdateSaporConfig,
        (state,action) => ({
            ...state,
            saporConfigData:action.saporConfigSavedData,
            isSaporConfigUpdated: true
        })
    ),
    on(ApplicationAction.isSaporConfigSaved,
        (state,action) => ({
            ...state,
            isSaporConfigUpdated: false
        })
    ),

    on(ApplicationAction.deleteSaporConfig,
        (state,action) => ({
            ...state,
            isSaporConfigDeleted: false
        })
    ),
    on(ApplicationAction.postDeleteSaporConfig,
        (state,action) => ({
            ...state,
            deleteSaporConfigMessage:action.message,
            isSaporConfigDeleted: true
        })
    ),
    on(ApplicationAction.isSaporConfigDeleted,
        (state,action) => ({
            ...state,
            isSaporConfigDeleted: false
        })
    ),

    on(ApplicationAction.getSaporConfig,
        (state,action) => ({
            ...state,
            isSaporConfigLoaded: false
        })
    ),
    on(ApplicationAction.loadSaporConfig,
        (state,action) => ({
            ...state,
            saporConfigList:action.saporConfigList,
            isSaporConfigLoaded: true
        })
    ),
    on(ApplicationAction.isSaporConfigLoaded,
        (state,action) => ({
            ...state,
            isSaporConfigLoaded: false
        })
    ),

    // Deployment Verification Feature  Starts here //
    on(ApplicationAction.saveLogTemplate,
        (state,action) => ({
            ...state,
            applicationId:action.applicationId,
            logTemplateData : action.logTemplateData
            //isLogTemplate: false
        })
    ),
    // on(ApplicationAction.postSaveVisibilityFeature,
    //     (state,action) => ({
    //         ...state,
    //         visibilityFeatureSavedData:action.visibilityFeatureSavedData,
    //         isVisibilityFeatureSaved: true
    //     })
    // ),
    // on(ApplicationAction.isVisibilityFeatureSaved,
    //     (state,action) => ({
    //         ...state,
    //         isVisibilityFeatureSaved: false
    //     })
    // ),

    on(ApplicationAction.getLogTemplateforaApplication,
        (state,action) => ({
            ...state,
            applicationId : action.applicationId,
            isLogTemplateforApplicationLoaded: false
        })
    ),
    on(ApplicationAction.loadLogTemplateforaApplication,
        (state,action) => ({
            ...state,
            logTemplatesofaApplication:action.logTemplatesofaApplication,
            isLogTemplateforApplicationLoaded: true
        })
    ),
    on(ApplicationAction.isLoadedLogTemplatesforaApplication,
        (state,action) => ({
            ...state,
            isLogTemplateforApplicationLoaded: false
        })
    ),

    on(ApplicationAction.saveMetricTemplate,
        (state,action) => ({
            ...state,
            applicationId:action.applicationId,
            metricTemplateData : action.metricTemplateData
            //isLogTemplate: false
        })
    ),

    on(ApplicationAction.getMetricTemplateforaApplication,
        (state,action) => ({
            ...state,
            applicationId : action.applicationId,
            isMetricTemplateforApplicationLoaded: false
        })
    ),
    on(ApplicationAction.loadMetricTemplateforaApplication,
        (state,action) => ({
            ...state,
            metricTemplatesofaApplication:action.metricTemplatesofaApplication,
            isMetricTemplateforApplicationLoaded: true
        })
    ),
    on(ApplicationAction.isLoadedMetricTemplatesforaApplication,
        (state,action) => ({
            ...state,
            isMetricTemplateforApplicationLoaded: false
        })
    ),

    on(ApplicationAction.deleteDeploymentVerificationFeature,
        (state,action) => ({
            ...state,
            applicationId : action.applicationId,
            serviceId : action.serviceId,
            isDeletedDeploymentVerificationFeature: false
        })
    ),
    on(ApplicationAction.postDeleteDeploymentVerificationFeature,
        (state,action) => ({
            ...state,
            deleteFeatureVisibilityMessage:action.deleteFeatureDeploymentVerificationMessage,
            isDeletedDeploymentVerificationFeature: true
        })
    ),
    on(ApplicationAction.isDeleteDeploymentVerificationFeature,
        (state,action) => ({
            ...state,
            isDeletedDeploymentVerificationFeature: false
        })
    ),

    on(ApplicationAction.getTemplatesForaService,
        (state,action) => ({
            ...state,
            applicationId : action.applicationId,
            serviceId : action.serviceId,
            isTemplatesForaServiceLoaded: false
        })
    ),
    on(ApplicationAction.loadTemplatesForaService,
        (state,action) => ({
            ...state,
            templatesForaService:action.templatesForaService,
            isTemplatesForaServiceLoaded: true
        })
    ),
    on(ApplicationAction.isLoadedTemplatesForaService,
        (state,action) => ({
            ...state,
            isTemplatesForaServiceLoaded: false
        })
    ),

    on(ApplicationAction.getLogTemplateDetails,
        (state,action) => ({
            ...state,
            applicationId : action.applicationId,
            templateName : action.templateName,
            isLogTemplateDetailsLoaded: false
        })
    ),
    on(ApplicationAction.loadLogTemplateDetails,
        (state,action) => ({
            ...state,
            logTemplateDetails:action.logTemplateDetails,
            isLogTemplateDetailsLoaded: true
        })
    ),
    on(ApplicationAction.isLoadedLogTemplate,
        (state,action) => ({
            ...state,
            isLogTemplateDetailsLoaded: false
        })
    ),

    on(ApplicationAction.getMetricTemplateDetails,
        (state,action) => ({
            ...state,
            applicationId : action.applicationId,
            templateName : action.templateName,
            isMetricTemplateDetailsLoaded: false
        })
    ),
    on(ApplicationAction.loadMetricTemplateDetails,
        (state,action) => ({
            ...state,
            metricTemplateDetails:action.metricTemplateDetails,
            isMetricTemplateDetailsLoaded: true
        })
    ),
    on(ApplicationAction.isLoadedMetricTemplate,
        (state,action) => ({
            ...state,
            isMetricTemplateDetailsLoaded: false
        })
    ),


    // Deployment Verification Feature  Ends here //

        // ###  Reseting template data for both metric and log ### // 
    )(applicationState,applicationAction);

    
}