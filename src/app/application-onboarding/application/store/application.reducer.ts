import { Pipeline } from '../../../models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationAction from './application.actions';
import { CreateApplication } from '../../../models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from '../../../models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from '../../../models/applicationOnboarding/applicationList/applicationList.model';
import { SaveApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/saveApplicationModel';
import { Environment } from 'src/app/models/applicationOnboarding/createApplicationModel/environmentModel/environment.model';


export interface State {

    // Create Application variable
    pipelineData: Pipeline;
    erroeMessage: string;
    editMode: boolean;
    parentPage: string;
    applicationData: CreateApplication;
    appSavedData: SaveApplication;
    appEnvionmentsData: Environment;
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
    templatesForToolType : any;
    templateForToolTypeSavedData : any;
    isTemplateForTooltypeSaved: boolean;
    templateForToolTypeData : any;
    toolconnectorwithTemplateSavedData: any;
    isToolConnectorwithTemplateSaved: boolean;
    toolconnectorwithTemplateData : any;
    approvalGatesListOfaService: any;
    isApprovalGatesOfaServiceLoaded: boolean;
    templateId: any;
    templateData: any;
    isTemplateDataForToolTypeLoaded: boolean;
    isTemplateDataForToolTypeUpdated: boolean;
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
    templatesForToolType : null,
    templateForToolTypeSavedData : null,
    isTemplateForTooltypeSaved: false,
    templateForToolTypeData : null,
    toolconnectorwithTemplateSavedData: null,
    isToolConnectorwithTemplateSaved: false,
    toolconnectorwithTemplateData : null,
    approvalGatesListOfaService: null,
    isApprovalGatesOfaServiceLoaded: false,
    templateId: null,
    templateData: null,
    isTemplateDataForToolTypeLoaded:false,
    isTemplateDataForToolTypeUpdated:false,

    // Sapor config variables
    saporConfigData : null,
    saporConfigSavedData : null,
    isSaporConfigSaved: false,

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
        on(ApplicationAction.saveEnvironments,
            state => ({
                ...state,
                applicationLoading:true
            })
        ),
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
        on(ApplicationAction.isApprovalGatesLoaded,
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
            approvalGateData:action.saporConfigData,
            isSaporConfigSaved: false
        })
    ),
    on(ApplicationAction.postSaveSaporConfig,
        (state,action) => ({
            ...state,
            approvalGateSavedData:action.saporConfigSavedData,
            isSaporConfigSaved: true
        })
    ),
    on(ApplicationAction.isSaporConfigSaved,
        (state,action) => ({
            ...state,
            isSaporConfigSaved: false
        })
    ),

        // ###  Reseting template data for both metric and log ### // 
    )(applicationState,applicationAction);

    
}