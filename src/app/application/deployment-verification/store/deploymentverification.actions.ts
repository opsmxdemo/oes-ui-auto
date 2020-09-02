import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics
export const loadDeploymentApp = createAction('[DeploymentVerification] LoadDeploymentApp' , props<{page:string}>());


export const loadLatestRun = createAction('[DeploymentVerification] LoadLatestRun');
export const errorOccured = createAction('[DeploymentVerification] ErrorOccured', props<{errorMessage:string}>());
export const fetchLatestRun = createAction('[DeploymentVerification] FetchLatestRun', props<{canaryId: string[]}>());
export const updateCanaryRun = createAction('[DeploymentVerification] UpdateCanaryRun', props<{canaryId:any}>());

export const loadApplications = createAction('[DeploymentVerification] LoadApplications');
export const fetchApplications = createAction('[DeploymentVerification] FetchApplications', props<{applicationList: any}>());

export const loadServices = createAction('[DeploymentVerification] LoadServices', props<{canaryId: any}>());
export const fetchServices = createAction('[DeploymentVerification] FetchServices', props<{servicesList:any}>());

export const loadApplicationHelath = createAction('[DeploymentVerification] LoadApplicationHelath', props<{canaryId: any}>());
export const fetchApplicationHelath = createAction('[DeploymentVerification] FetchApplicationHelath', props<{applicationHealthDetails:any}>());

export const loadServiceInformation = createAction('[DeploymentVerification] LoadServiceInformation', props<{canaryId: any,serviceId: number}>());
export const fetchServiceInformation = createAction('[DeploymentVerification] FetchServiceInformation', props<{serviceSummary:any}>());

export const loadcancelRunningCanary = createAction('[DeploymentVerification] LoadCancelRunningCanary', props<{canaryId: number}>());
export const fetchcancelRunningCanaryStatus = createAction('[DeploymentVerification] FetchCancelRunningCanaryStatus', props<{cancelRunningCanaryData:any}>());
