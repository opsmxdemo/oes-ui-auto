import { createAction, props } from '@ngrx/store';
import { Pipeline } from '../../../models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { CreateApplication } from '../../../models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from '../../../models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from 'src/app/models/applicationOnboarding/applicationList/applicationList.model';
import { fetchSupportedDatasources } from '../../data-source/store/data-source.actions';
import { SaveApplication } from '../../../models/applicationOnboarding/createApplicationModel/saveApplicationModel';
import {Service} from '../../../models/applicationOnboarding/createApplicationModel/servicesModel/serviceModel'
import { Environment } from '../../../models/applicationOnboarding/createApplicationModel/environmentModel/environment.model';
import {GroupPermission } from '../../../models/applicationOnboarding/createApplicationModel/groupPermissionModel/groupPermission.model';


// Below action related to create application
export const fetchSupportedFeatures = createAction('[Application] FetchSupportedFeatures', props<{supportedFeaturesData: any}>());
export const loadApp = createAction('[Application] LoadApp' , props<{page:string}>());
export const loadOESData = createAction('[Application] LoadOESData');
export const initialOESCallFail = createAction('[Application] InitialOESCallFail', props<{errorMessage:string,index:number}>());
export const fetchPipeline = createAction('[Application] FetchPipeline', props<{ pipelineData: Pipeline }>());
export const errorOccured = createAction('[Application] ErrorOccured', props<{errorMessage:string}>());
export const fetchAppData = createAction('[Application] FetchAppData', props<{appData:CreateApplication,applicationId:string}>())
export const createApplication = createAction('[Application] CreateApplication', props<{appData:CreateApplication}>())
export const dataSaved = createAction('[Application] DataSaved', props<{applicationName:string,dataType:string}>());
export const fetchCloudAccount = createAction('[Application] FetchCloudAccount', props<{cloudAccount:CloudAccount}>());
export const fetchImageSource = createAction('[Application] FetchImageSource', props<{imageSource: string[]}>());
export const loadDockerImageName = createAction('[Application] LoadDockerImageName', props<{imageSourceName:string}>());
export const fetchDockerImageName = createAction('[Application] FetchDockerImageName', props<{dockerImageData:any}>());
export const isFetchDockerImageDataUpdated = createAction('[Application] IsFetchDockerImageDataUpdated');
export const fetchUserGrops = createAction('[Application] FetchUserGrops', props<{userGroupData:string[]}>());
export const fetchUserGropsPermissions = createAction('[Application] FetchUserGropsPermissions', props<{userGroupPermissionsData:[]}>());
// Below refactor actions goes here
export const saveApplication = createAction('[Application] SaveApplication', props<{applicationData:SaveApplication}>());

export const savedApplication = createAction('[Application] SavedApplication', props<{savedApplicationResponse: any,dataType:string}>());
export const isSavedApplicationSaved = createAction('[Application] IsSavedApplicationLoaded');

export const saveService = createAction('[Application] SaveService', props<{applicationId:any,serviceSaveData:any}>());
export const savedService = createAction('[Application] SavedService', props<{savedServiceResponse: any,dataType:string}>());

// Below actions related to group permissions

export const saveGroupPermissions = createAction('[Application] SaveGroupPermissions', props<{applicationId:any,groupPermissionData: GroupPermission}>());
export const groupPermissionDataSaved = createAction('[Application] groupPermissionDataSaved', props<{applicationName:string,dataType:string}>());

export const getGroupPermissions = createAction('[Application] GetGroupPermissions', props<{applicationId: any}>());
export const loadGroupPermissions = createAction('[Application] LoadGroupPermissions', props<{groupPermissionsListData: any}>());
export const isgetGroupPermissionsLoaded = createAction('[Application] IsgetGroupPermissionsLoaded');

export const updateGroupPermissions = createAction('[Application] UpdateGroupPermissions', props<{applicationId: any, groupPermissionsListData: any}>());
export const postGroupPermissions = createAction('[Application] PostGroupPermissions', props<{groupPermissionsListUpdatedData: any}>());
export const isgetGroupPermissionUpdated = createAction('[Application] IsgetGroupPermissionUpdated');

export const deleteGroupPermissions = createAction('[Application] DeleteGroupPermissions', props<{applicationId:any}>());
export const groupPermissiondeletedSuccessfully = createAction('[Application] GroupPermissiondeletedSuccessfully');


// Below action is related to edit application 
export const enableEditMode = createAction('[Application] EnableEditMode', props<{editMode:boolean,applicationName:string,page:string,applicationId:string}>());
export const updateApplication = createAction('[Application] UpdateApplication', props<{applicationId:number,appData:any}>());
export const updateApplicationDone = createAction('[Application] updateApplicationDone');
export const disabledEditMode = createAction('[Application] DisabledEditMode');

// Below action is related to application list
export const loadAppList = createAction('[Application] LoadAppList');
export const fetchAppList = createAction('[Application] FetchAppList', props<{Applist:any}>());
export const appDelete = createAction('[Application] AppDelete', props<{applicationName:string,index:number,id:number}>());
export const appDeletedSuccessfully = createAction('[Application] AppDeletedSuccessfully', props<{index:number}>());

// Below action is related to create and edit log template 
export const createdLogTemplate = createAction('[Application] CreatedLogTemplate', props<{logTemplateData:any}>());
export const updatedLogTemplate = createAction('[Application] UpdatedLogTemplate', props<{logTemplateData:any,index:number}>());

// Below action is related to log template creation
export const loadSupportingDatasources = createAction('[Application] LoadSupportingDatasources');
export const fetchDatasources = createAction('[Application] FetchDatasources', props<{datasources:any}>());
export const loadMonitoringAccountName = createAction('[Application] LoadMonitoringAccountName', props<{monitoringSourceName:string}>());
export const fetchMonitoringAccounts = createAction('[Application] fetchMonitoringAccounts', props<{logAccounts:any}>());
export const loadLogTopics = createAction('[Application] LoadLogTopics');
export const fetchLogTopics = createAction('[Application] FetchLogTopics', props<{logslist:[]}>());
export const isLoadedLogTopics = createAction('[Application] IsLoadedLogTopics');
export const loadClusterTags = createAction('[Application] LoadClusterTags');
export const fetchClusterTags = createAction('[Application] FetchClusterTags', props<{clusterTags:[]}>());
export const loadCustomTags = createAction('[Application] LoadCustomTags',props<{applicationId: any}>());
export const fetchCustomTags = createAction('[Application] FetchCustomTags', props<{tags:any}>());
export const addCustomTags = createAction('[Application] AddCustomTags',props<{applicationId: any,newtagData:any}>());
export const savedCustomTag = createAction('[Application] SavedCustomTag', props<{savedTagResponse: any}>());
export const editCustomTags = createAction('[Application] EditCustomTags',props<{applicationId: any,tagId:any,edittagData:any}>());
export const savededitCustomTag = createAction('[Application] SavededitCustomTag', props<{savedEditTagResponse: any}>());
export const deleteCustomTags = createAction('[Application] DeleteCustomTags',props<{applicationId: any,tagId:any}>());
export const fetchDeleteCustomTag = createAction('[Application] FetchDeleteCustomTag', props<{deleteTagResponse: any}>());
export const getScoringAlgo = createAction('[Application] GetScoringAlgo');
export const fetchScoringAlgo = createAction('[Application] FetchScoringAlgo', props<{scoringAlgoResponse: any}>());


export const loadDataSourceResponseKey = createAction('[Application] LoadDataSourceResponseKey', props<{responseKeys:[]}>());
export const fetchDataSourceResponseKey = createAction('[Application] FetchDataSourceResponseKey', props<{accountName:any}>());
export const loadedDataSourceResponseKey = createAction('[Application] LoadedDataSourceResponseKey');


// Below action is related to create Metric template 
export const createdMetricTemplate = createAction('[Application] CreatedMetricTemplate', props<{metricTemplateData:any}>());
export const updatedMetricTemplate = createAction('[Application] UpdatedMetricTemplate', props<{metricTemplateData:any,index:number}>());

export const fetchAccountForCustomDataSource = createAction('[Application] FetchAccountCustomForDataSource', props<{datasource:any}>());
export const loadAccountForCustomDataSource = createAction('[Application] LoadAccountCustomForDataSource', props<{customDSAccounts:any}>());
export const loadedAccountForCustomDataSource = createAction('[Application] LoadedAccountForCustomDataSource');

export const fetchAccountForAPMDataSource = createAction('[Application] FetchAccountAPMForDataSource', props<{datasource:any}>());
export const loadAccountForAPMDataSource = createAction('[Application] LoadAccountAPMForDataSource', props<{APMDSAccounts:any}>());
export const loadedAccountForAPMDataSource = createAction('[Application] LoadedAccountForAPMDataSource');

export const fetchAccountForInfraDataSource = createAction('[Application] FetchAccountInfraForDataSource', props<{datasource:any}>());
export const loadAccountForInfraDataSource = createAction('[Application] LoadAccountInfraForDataSource', props<{InfraDSAccounts:any}>());
export const loadedAccountForInfraDataSource = createAction('[Application] LoadedAccountForInfraDataSource');

export const fetchApplicationForAPMAccounts = createAction('[Application] FetchApplicationForAPMAccounts', props<{account:any,sourceType:any}>());
export const loadApplicationForAPMAccounts = createAction('[Application] LoadApplicationForAPMAccounts', props<{APMApplicationForAccounts:any}>());
export const loadedApplicationForAPMAccounts = createAction('[Application] LoadedApplicationForAPMAccounts');

export const fetchInfraGenerateCookbook = createAction('[Application] FetchInfraGenerateCookbook', props<{account:any,applicationName:any,metricType:any,sourceType:any,templateName:any}>());
export const loadInfraGenerateCookbook = createAction('[Application] LoadInfraGenerateCookbook', props<{INFRACookbook:any}>());
export const loadedInfraGenerateCookbook = createAction('[Application] LoadedInfraGenerateCookbook');

export const fetchAPMGenerateCookbook = createAction('[Application] FetchAPMGenerateCookbook', props<{account:any,applicationName:any,metricType:any,sourceType:any,templateName:any}>());
export const loadAPMGenerateCookbook = createAction('[Application] LoadAPMGenerateCookbook', props<{APMCookbook:any}>());
export const loadedAPMGenerateCookbook = createAction('[Application] LoadedAPMGenerateCookbook');

// Below action is used for both reseting metric and log template data
export const resetTemplateData = createAction('[Application] ResetTemplateData');

// Below action is used for sapor configuration

export const saveSaporConfig = createAction('[Application] SaveSaporConfig', props<{saporConfigData:any}>());
export const postSaveSaporConfig = createAction('[Application] PostSaveSaporConfig', props<{saporConfigSavedData:any}>());
export const isSaporConfigSaved = createAction('[Application] isSaporConfigSaved');

export const deleteSaporConfig = createAction('[Application] DeleteSaporConfig', props<{applicationId:any,serviceId:any}>());
export const postDeleteSaporConfig = createAction('[Application] PostDeleteSaporConfig', props<{message:any}>());
export const isSaporConfigDeleted = createAction('[Application] IsSaporConfigDeleted');

export const getSaporConfig = createAction('[Application] GetSaporConfig',props<{applicationId:any,serviceId:any}>());
export const loadSaporConfig = createAction('[Application] LoadSaporConfig', props<{saporConfigList:any}>());
export const isSaporConfigLoaded = createAction('[Application] IsSaporConfigLoaded');

export const updateSaporConfig = createAction('[Application] UpdateSaporConfig', props<{applicationId:any,serviceId:any,saporConfigData:any}>());
export const postUpdateSaporConfig = createAction('[Application] PostUpdateSaporConfig', props<{saporConfigSavedData:any}>());
export const isSaporConfigUpdated = createAction('[Application] isSaporConfigUpdated');

// Below action is used for environments 

export const saveEnvironments = createAction('[Application] SaveEnvironments', props<{applicationId: any,environmentsData: Environment}>());
export const environmentDataSaved = createAction('[Application] EnvironmentDataSaved', props<{applicationName:string,dataType:string}>());

export const getEnvironments = createAction('[Application] GetEnvironments', props<{applicationId: any}>());
export const loadEnvironments = createAction('[Application] LoadEnvironments', props<{environmentsListGetData: any}>());
export const isgetEnvironmentsListLoaded = createAction('[Application] IsgetEnvironmentsListLoaded');

export const updateEnvironments = createAction('[Application] UpdateEnvironments', props<{applicationId: any, environmentsListData: any}>());
export const postUpdateEnvironments = createAction('[Application] PostUpdateEnvironments', props<{environmentsListUpdatedData: any}>());
export const isgetEnvironmentsUpdated = createAction('[Application] IsgetEnvironmentsUpdated');

export const deleteEnvironments = createAction('[Application] DeleteEnvironments', props<{applicationId:any}>());
export const environmentdeletedSuccessfully = createAction('[Application] EnvironmentsDeletedSuccessfully');

// Below action is used for get imageSource

export const getImageSource = createAction('[Application] getImageSource', props<{applicationId : any}>());
export const loadImageSource = createAction('[Application] LoadImageSource', props<{imageSourceListData: any}>());
export const isgetImageSourceLoaded = createAction('[Application] IsgetImageSourceLoaded');


//Actions to Visibility Feature
export const saveApprovalGate = createAction('[Application] SaveApprovalGate', props<{approvalGateData:any}>());
export const postSaveApprovalGate = createAction('[Application] PostSaveApprovalGate', props<{approvalGateSavedData:any}>());
export const isApprovalGateSaved = createAction('[Application] IsApprovalGateSaved');

export const getApprovalGates = createAction('[Application] GetApprovalGates');
export const loadApprovalGates = createAction('[Application] LoadApprovalGates', props<{approvalGatesList:any}>());
export const isApprovalGatesLoaded = createAction('[Application] IsApprovalGatesLoaded');

export const editApprovalGate = createAction('[Application] EditApprovalGate',props<{gateId:any, gateDataToEdit : any}>());
export const postEditApprovalGate = createAction('[Application] PostEditApprovalGate', props<{message:any}>());
export const isApprovalGateEdited = createAction('[Application] IsApprovalGateEdited');

export const deleteApprovalGate = createAction('[Application] DeleteApprovalGate', props<{gateId:any}>());
export const postDeleteApprovalGate = createAction('[Application] PostDeleteApprovalGate', props<{message:any}>());
export const isApprovalGatesDeleted = createAction('[Application] IsApprovalGatesDeleted');

export const getConfiguredToolConnectorTypes = createAction('[Application] GetConfiguredToolConnectorTypes');
export const loadConfiguredToolConnectorTypes = createAction('[Application] LoadConfiguredToolConnectorTypes', props<{configuredToolConnectorTypes:any}>());
export const isloadedConfiguredToolConnectorTypes = createAction('[Application] IsloadedConfiguredToolConnectorTypes');

export const getAccountToolType = createAction('[Application] GetAccountToolType', props<{connectorType : any}>());
export const loadAccountToolType = createAction('[Application] LoadAccountToolType', props<{accountsForToolType:any}>());
export const isLoadedAccountToolType = createAction('[Application] IsLoadedAccountToolType');

export const getTemplatesToolType = createAction('[Application] GetTemplatesToolType', props<{connectorType : any}>());
export const loadTemplateToolType = createAction('[Application] LoadTemplateToolType', props<{templatesForToolType:any}>());
export const isLoadedTemplateToolType = createAction('[Application] IsLoadedTemplateToolType');

export const getTemplateDataForTooltype = createAction('[Application] GetTemplateForTooltype', props<{templateId:any}>());
export const loadTemplateDataForTooltype = createAction('[Application] LoadTemplateForTooltype', props<{templateData:any}>());
export const isLoadedTemplateData = createAction('[Application] IsLoadedTemplateData');

export const getFeaturesForAService = createAction('[Application] GetFeaturesForAService', props<{serviceId:any}>());
export const loadFetauresForService = createAction('[Application] LoadFetauresForService', props<{serviceFeatureList:any}>());
export const isLoadedServiceFeatureList = createAction('[Application] isLoadedServiceFeatureList');

export const updateTemplateForTooltype = createAction('[Application] UpdateTemplateForTooltype', props<{updatedTemplateForToolTypeData:any}>());
export const putSaveTemplateForTooltype = createAction('[Application] PutSaveTemplateForTooltype', props<{templateForToolTypeSavedData:any}>());
export const isTemplateForTooltypeUpdated = createAction('[Application] IsTemplateForTooltypeUpdated');

export const saveTemplateForTooltype = createAction('[Application] SaveTemplateForTooltype', props<{templateForToolTypeData:any}>());
export const postSaveTemplateForTooltype = createAction('[Application] PostSaveTemplateForTooltype', props<{templateForToolTypeSavedData:any}>());
export const isTemplateForTooltypeSaved = createAction('[Application] IsTemplateForTooltypeSaved');

export const saveToolConnectorWithTemplate = createAction('[Application] SaveToolConnectorWithTemplate', props<{gateId : any,connectorId : any, toolconnectorwithTemplateData:any}>());
export const postSaveToolConnectorWithTemplate = createAction('[Application] PostSaveToolConnectorWithTemplate', props<{toolconnectorwithTemplateSavedData:any}>());
export const isToolConnectorWithTemplateSaved = createAction('[Application] IsToolConnectorWithTemplateSaved');

export const getApprovalGatesOfaService = createAction('[Application] GetApprovalGatesOfaService', props<{serviceId : any}>());
export const loadApprovalGatesOfaService = createAction('[Application] LoadApprovalGatesOfaService', props<{approvalGatesListOfaService:any}>());
export const isApprovalGatesOfaServiceLoaded = createAction('[Application] IsApprovalGatesOfaServiceLoaded');

export const saveVisibilityFeature = createAction('[Application] SaveVisibilityFeature', props<{approvalGateData:any}>());
export const postSaveVisibilityFeature = createAction('[Application] PostSaveVisibilityFeature', props<{visibilityFeatureSavedData:any}>());
export const isVisibilityFeatureSaved = createAction('[Application] IsVisibilityFeatureSaved');

export const getToolConnectorForaGate = createAction('[Application] GetToolConnectorForaGate', props<{gateId : any}>());
export const loadToolConnectorForaGate = createAction('[Application] LoadToolConnectorForaGate', props<{configuredToolConnectorData:any}>());
export const isLoadedToolConnectorForaGate = createAction('[Application] IsLoadedToolConnectorForaGate');

export const deleteVisibilityFeature = createAction('[Application] DeleteVisibilityFeature', props<{serviceId : any,gateId:any}>());
export const postDeleteVisibilityFeature = createAction('[Application] PostDeleteVisibilityFeature', props<{deleteFeatureVisibilityMessage:any}>());
export const isDeleteVisibilityFeature = createAction('[Application] IsDeleteVisibilityFeature');

export const deleteService = createAction('[Application] DeleteService', props<{applicationId: any,serviceId : any}>());
export const postDeleteService = createAction('[Application] PostDeleteService', props<{deleteServiceMessage:any}>());
export const isDeleteService = createAction('[Application] IsDeleteService');


//Deployment verification Feature actions
//POST /autopilot/api/v1/applications/{applicationId}/logTemplates	
export const saveLogTemplate = createAction('[Application] SaveLogTemplate', props<{applicationId: number,logTemplateData:any}>());
export const savedLogTemplate = createAction('[Application] SavedLogTemplate', props<{savedLogTemplateData:any}>());
export const isLogTemplateSaved = createAction('[Application] IsLogTemplateSaved');

//POST /autopilot/api/v1/applications/1/metricTemplates?isEdit=false
export const saveMetricTemplate = createAction('[Application] SaveMetricTemplate', props<{applicationId : any,metricTemplateData:any}>());
export const savedMetricTemplate = createAction('[Application] SavedMetricTemplate', props<{savedMetricTemplateData:any}>());
export const isMetricTemplateSaved = createAction('[Application] IsMetricTemplateSaved');

//GET - /autopilot/api/v1/applications/1/logTemplates
export const getLogTemplateforaApplication = createAction('[Application] GetLogTemplateforaApplication', props<{applicationId:any}>());
export const loadLogTemplateforaApplication = createAction('[Application] LoadLogTemplateforaApplication', props<{logTemplatesofaApplication:any}>());
export const isLoadedLogTemplatesforaApplication = createAction('[Application] IsLoadedLogTemplatesforaApplication');


export const getMetricTemplateforaApplication = createAction('[Application] GetMetricTemplateforaApplication', props<{applicationId:any}>());
export const loadMetricTemplateforaApplication = createAction('[Application] LoadMetricTemplateforaApplication', props<{metricTemplatesofaApplication:any}>());
export const isLoadedMetricTemplatesforaApplication = createAction('[Application] IsLoadedMetricTemplatesforaApplication');

//PUT - autopilot/api/v1/applications/1/logTemplates/{logTemplateName}	
export const editLogTemplate = createAction('[Application] EditLogTemplate', props<{applicationId : any, templateName : any,logTemplateDataToEdit:any}>());
export const editedLogTemplate = createAction('[Application] EditedLogTemplate', props<{editedLogTemplateData:any}>());
export const isLogTemplateEdited = createAction('[Application] IsLogTemplateEdited');

//POST /autopilot/api/v1/applications/1/metricTemplates?isEdit=true
export const editMetricTemplate = createAction('[Application] EditMetricTemplate', props<{applicationId : any, templateName: any, metricTemplateDataToEdit:any}>());
export const editedMetricTemplate = createAction('[Application] EditedMetricTemplate', props<{editedMetricTemplateData:any}>());
export const isMetricTemplateEdited = createAction('[Application] IsMetricTemplateEdited');

///autopilot/api/v1/applications/{applicationId}/service/{serviceId}/template
export const getTemplatesForaService = createAction('[Application] GetTemplatesForaService', props<{applicationId: any,serviceId:any}>());
export const loadTemplatesForaService = createAction('[Application] LoadTemplatesForaService', props<{templatesForaService:any}>());
export const isLoadedTemplatesForaService = createAction('[Application] IsLoadedTemplatesForaService');

//GET -  /autopilot/api/v1/applications/{applicationId}/logTemplates/{logTemplateName}
export const getLogTemplateDetails = createAction('[Application] GetLogTemplateDetails', props<{applicationId:any,templateName :any }>());
export const loadLogTemplateDetails = createAction('[Application] LoadLogTemplateDetails', props<{logTemplateDetails:any}>());
export const isLoadedLogTemplate = createAction('[Application] IsLoadedLogTemplate');

//GET  /autopilot/api/v1/applications/{applicationId}/metricTemplates/{metricTemplateName}
export const getMetricTemplateDetails = createAction('[Application] GetMetricTemplateDetails', props<{applicationId:any,templateName :any }>());
export const loadMetricTemplateDetails = createAction('[Application] LoadMetricTemplateDetails', props<{metricTemplateDetails:any}>());
export const isLoadedMetricTemplate = createAction('[Application] IsLoadedMetricTemplate');

//POST - /applications/{applicationId}/service/{serviceId}/template
///dashboardservice/v2/autopilot/service/feature/configuration
export const saveDeploymentVerificationFeature = createAction('[Application] SaveDeploymentVerificationFeature', props<{templateServiceData:any}>());
export const postDeploymentVerificationFeature = createAction('[Application] PostDeploymentVerificationFeature', props<{deploymentVerificationSavedData:any}>());
export const isDeploymentVerificationSaved = createAction('[Application] IsDeploymentVerificationSaved');

///dashboardservice/v2/autopilot/service/{serviceId}/application/{applicationId}/feature/configuration
export const deleteDeploymentVerificationFeature = createAction('[Application] DeleteDeploymentVerificationFeature', props<{serviceId : any,applicationId:any}>());
export const postDeleteDeploymentVerificationFeature = createAction('[Application] PostDeleteDeploymentVerificationFeature', props<{deleteFeatureDeploymentVerificationMessage:any}>());
export const isDeleteDeploymentVerificationFeature = createAction('[Application] IsDeleteDeploymentVerificationFeature');

