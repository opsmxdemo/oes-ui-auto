import { createAction, props } from '@ngrx/store';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from 'src/app/models/applicationOnboarding/applicationList/applicationList.model';

// Below action related to create application
export const loadApp = createAction('[Application-OnBoarding] LoadApp' , props<{page:string}>());
export const fetchPipeline = createAction('[Application-OnBoarding] FetchPipeline', props<{ pipelineData: Pipeline }>());
export const errorOccured = createAction('[Application-OnBoarding] ErrorOccured', props<{errorMessage:string}>());
export const fetchAppData = createAction('[Application-OnBoarding] FetchAppData', props<{appData:CreateApplication}>())
export const createApplication = createAction('[Application-OnBoarding] CreateApplication', props<{appData:CreateApplication}>())
export const dataSaved = createAction('[Application-OnBoarding] DataSaved');
export const fetchCloudAccount = createAction('[Application-OnBoarding] FetchCloudAccount', props<{cloudAccount:CloudAccount}>());

// Below action is related to edit application 
export const enableEditMode = createAction('[Application-OnBoarding] EnableEditMode', props<{editMode:boolean,applicationName:string,page:string}>());

// Below action is related to application list
export const loadAppList = createAction('[Application-OnBoarding] LoadAppList');
export const fetchAppList = createAction('[Application-OnBoarding] FetchAppList', props<{Applist:ApplicationList[]}>());
export const appDelete = createAction('[Application-OnBoarding] AppDelete', props<{index:number}>());
