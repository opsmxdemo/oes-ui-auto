import { createAction, props } from '@ngrx/store';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';

export const loadApp = createAction('[Application-OnBoarding] LoadApp');
export const fetchPipeline = createAction('[Application-OnBoarding] FetchPipeline', props<{ pipelineData: Pipeline }>());
export const errorOccured = createAction('[Application-OnBoarding] ErrorOccured', props<{errorMessage:string}>());
export const enableEditMode = createAction('[Application-OnBoarding] EnableEditMode', props<{editMode:boolean,applicationName:string}>());
export const fetchAppData = createAction('[Application-OnBoarding] FetchAppData', props<{appData:CreateApplication}>())
export const createApplication = createAction('[Application-OnBoarding] CreateApplication', props<{appData:CreateApplication}>())
export const dataSaved = createAction('[Application-OnBoarding] DataSaved');