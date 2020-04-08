import { createAction, props } from '@ngrx/store';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';

export const loadApp = createAction('[Application-OnBoarding] LoadApp');
export const fetchPipeline = createAction('[Application-OnBoarding] FetchPipeline', props<{ pipelineData: Pipeline }>());
export const errorOccured = createAction('[Application-OnBoarding] ErrorOccured', props<{errorMessage:string}>());