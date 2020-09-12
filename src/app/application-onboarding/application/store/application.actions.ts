import { createAction, props } from '@ngrx/store';
import { Pipeline } from '../../../models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { CreateApplication } from '../../../models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from '../../../models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from 'src/app/models/applicationOnboarding/applicationList/applicationList.model';

// Below action related to create application
export const loadApp = createAction('[Application] LoadApp' , props<{page:string}>());
export const fetchPipeline = createAction('[Application] FetchPipeline', props<{ pipelineData: Pipeline }>());
export const errorOccured = createAction('[Application] ErrorOccured', props<{errorMessage:string}>());
export const fetchAppData = createAction('[Application] FetchAppData', props<{appData:CreateApplication}>())
export const createApplication = createAction('[Application] CreateApplication', props<{appData:CreateApplication}>())
export const dataSaved = createAction('[Application] DataSaved', props<{applicationName:string,dataType:string}>());
export const fetchCloudAccount = createAction('[Application] FetchCloudAccount', props<{cloudAccount:CloudAccount}>());
export const fetchImageSource = createAction('[Application] FetchImageSource', props<{imageSource: string[]}>());
export const loadDockerImageName = createAction('[Application] LoadDockerImageName', props<{imageSourceName:string}>());
export const fetchDockerImageName = createAction('[Application] FetchDockerImageName', props<{dockerImageData:any}>());
export const fetchUserGrops = createAction('[Application] FetchUserGrops', props<{userGroupData:string[]}>());
export const fetchUserGropsPermissions = createAction('[Application] FetchUserGropsPermissions', props<{userGroupPermissionsData:[]}>());

// Below action is related to edit application 
export const enableEditMode = createAction('[Application] EnableEditMode', props<{editMode:boolean,applicationName:string,page:string}>());
export const updateApplication = createAction('[Application] UpdateApplication', props<{appData:CreateApplication,applicationId:number}>());
export const disabledEditMode = createAction('[Application] DisabledEditMode');

// Below action is related to application list
export const loadAppList = createAction('[Application] LoadAppList');
export const fetchAppList = createAction('[Application] FetchAppList', props<{Applist:any}>());
export const appDelete = createAction('[Application] AppDelete', props<{applicationName:string,index:number,id:number}>());
export const appDeletedSuccessfully = createAction('[Application] AppDeletedSuccessfully', props<{index:number}>());

// Below action is related to create log template 
export const createdLogTemplate = createAction('[Application] CreatedLogTemplate', props<{logTemplateData:any}>());

// Below action is related to log template creation
export const loadSupportingDatasources = createAction('[Application] LoadSupportingDatasources');
export const fetchDatasources = createAction('[Application] FetchDatasources', props<{datasources:any}>());
export const loadMonitoringAccountName = createAction('[Application] LoadMonitoringAccountName', props<{monitoringSourceName:string}>());
export const fetchMonitoringAccounts = createAction('[Application] fetchMonitoringAccounts', props<{logAccounts:any}>());
export const loadLogTopics = createAction('[Application] LoadLogTopics');
export const fetchLogTopics = createAction('[Application] FetchLogTopics', props<{logslist:[]}>());
export const loadClusterTags = createAction('[Application] LoadClusterTags');
export const fetchClusterTags = createAction('[Application] FetchClusterTags', props<{clusterTags:[]}>());


// Below action is related to create Metric template 
export const createdMetricTemplate = createAction('[Application] CreatedMetricTemplate', props<{metricTemplateData:any}>());
export const fetchAccountForCustomDataSource = createAction('[Application] FetchAccountCustomForDataSource', props<{datasource:any}>());
export const loadAccountForCustomDataSource = createAction('[Application] LoadAccountCustomForDataSource', props<{customDSAccounts:any}>());
export const fetchAccountForAPMDataSource = createAction('[Application] FetchAccountAPMForDataSource', props<{datasource:any}>());
export const loadAccountForAPMDataSource = createAction('[Application] LoadAccountAPMForDataSource', props<{APMDSAccounts:any}>());
export const fetchAccountForInfraDataSource = createAction('[Application] FetchAccountInfraForDataSource', props<{datasource:any}>());
export const loadAccountForInfraDataSource = createAction('[Application] LoadAccountInfraForDataSource', props<{InfraDSAccounts:any}>());

export const fetchApplicationForAPMAccounts = createAction('[Application] FetchApplicationForAPMAccounts', props<{account:any,sourceType:any}>());
export const loadApplicationForAPMAccounts = createAction('[Application] LoadApplicationForAPMAccounts', props<{APMApplicationForAccounts:any}>());

export const fetchInfraGenerateCookbook = createAction('[Application] FetchInfraGenerateCookbook', props<{account:any,applicationName:any,metricType:any,sourceType:any,templateName:any}>());
export const loadInfraGenerateCookbook = createAction('[Application] LoadInfraGenerateCookbook', props<{INFRACookbook:any}>());
export const fetchAPMGenerateCookbook = createAction('[Application] FetchAPMGenerateCookbook', props<{account:any,applicationName:any,metricType:any,sourceType:any,templateName:any}>());
export const loadAPMGenerateCookbook = createAction('[Application] LoadAPMGenerateCookbook', props<{APMCookbook:any}>());

// Below action is used for both reseting metric and log template data
export const resetTemplateData = createAction('[Application] ResetTemplateData');
