import { createAction, props } from '@ngrx/store';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from 'src/app/models/applicationOnboarding/applicationList/applicationList.model';
import { CreateAccount } from 'src/app/models/applicationOnboarding/createAccountModel/createAccount.model'

// Below action related to create application
export const loadApp = createAction('[Application-OnBoarding] LoadApp' , props<{page:string}>());
export const fetchPipeline = createAction('[Application-OnBoarding] FetchPipeline', props<{ pipelineData: Pipeline }>());
export const errorOccured = createAction('[Application-OnBoarding] ErrorOccured', props<{errorMessage:string}>());
export const fetchAppData = createAction('[Application-OnBoarding] FetchAppData', props<{appData:CreateApplication}>())
export const createApplication = createAction('[Application-OnBoarding] CreateApplication', props<{appData:CreateApplication}>())
export const dataSaved = createAction('[Application-OnBoarding] DataSaved');
export const fetchCloudAccount = createAction('[Application-OnBoarding] FetchCloudAccount', props<{cloudAccount:CloudAccount}>());
export const fetchImageSource = createAction('[Application-OnBoarding] FetchImageSource', props<{imageSource: string[]}>());
export const loadDockerImageName = createAction('[Application-OnBoarding] LoadDockerImageName', props<{imageSourceName:string}>());
export const fetchDockerImageName = createAction('[Application-OnBoarding] FetchDockerImageName', props<{dockerImageData:any}>());

// Below action is related to edit application 
export const enableEditMode = createAction('[Application-OnBoarding] EnableEditMode', props<{editMode:boolean,applicationName:string,page:string}>());
export const updateApplication = createAction('[Application-OnBoarding] UpdateApplication', props<{appData:CreateApplication}>());
export const disabledEditMode = createAction('[Application-OnBoarding] DisabledEditMode');

// Below action is related to application list
export const loadAppList = createAction('[Application-OnBoarding] LoadAppList');
export const fetchAppList = createAction('[Application-OnBoarding] FetchAppList', props<{Applist:ApplicationList[]}>());
export const appDelete = createAction('[Application-OnBoarding] AppDelete', props<{applicationName:string,index:number}>());
export const appDeletedSuccessfully = createAction('[Application-OnBoarding] AppDeletedSuccessfully', props<{index:number}>());

// Below action related to Account
export const loadAccount = createAction('[Application-OnBoarding] LoadAccount' , props<{page:string}>());
export const createAccount = createAction('[Application-OnBoarding] createAccount', props<{accountData:any,postData:any}>())
export const updateAccount = createAction('[Application-OnBoarding] updateAccount', props<{accountData:any,postData:any}>())
export const accountDataSaved = createAction('[Application-onBoarding] AccountDataSaved');

// Below action is related to accounts list
export const loadAccountList = createAction('[Application-OnBoarding] LoadAccountList');
export const fetchAccountList = createAction('[Application-OnBoarding] FetchAccountList', props<{Accountlist: any}>());
export const deleteAccount = createAction('[Application-onBoarding] DeleteAccount', props<{accountName:any,index:number}>())
export const accountDeleted = createAction('[Application-OnBoarding] AccountDeleted', props<{index:number}>());
//export const accountDeletedSuccessfully = createAction('[Application-OnBoarding] AccountDeletedSuccessfully', props<{index:number}>());

// Below action is related to datasources
export const loadDatasourceList = createAction('[Application-onBoarding] LoadDatasourceList');
export const fetchDatasourceList  = createAction('[Application-OnBoarding] FetchDatasourceList', props<{DatasourceList:any}>());
export const deleteDatasourceAccount = createAction('[Application-onBoarding] DeleteDatasourceAccount', props<{accountName:any,index:number}>())
export const DatasourceaccountDeleted = createAction('[Application-OnBoarding] DatasourceAccountDeleted', props<{index:number}>());
