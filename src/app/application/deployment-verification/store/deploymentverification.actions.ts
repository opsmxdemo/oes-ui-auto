import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics

export const loadLatestRun = createAction('[DeploymentVerification] LoadLatestRun');
export const errorOccured = createAction('[DeploymentVerification] ErrorOccured', props<{errorMessage:string}>());
export const fetchLatestRun = createAction('[DeploymentVerification] FetchLatestRun', props<{canaryRun:any}>());

