import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics
export const errorOccured = createAction('[Visibility] ErrorOccured', props<{ errorMessage: string }>());

export const loadApplications = createAction('[Visibility] LoadApplications');
export const fetchApplications = createAction('[Visibility] FetchApplications', props<{ applicationList: any }>());
export const stopLoadingApplication = createAction('[Visibility] stopLoadingApplication');

export const loadServices = createAction('[Visibility] LoadServices', props<{ applicationId: any }>());
export const fetchServices = createAction('[Visibility] FetchServices', props<{ servicesList: any }>());
export const stopLoadingService = createAction('[Visibility] stopLoadingServices');

export const loadToolConnectors = createAction('[Visibility] LoadToolConnectors', props<{ id: any }>());
export const fetchToolConnectors = createAction('[Visibility] FetchToolConnectors', props<{ toolConnectors: any }>());
export const stopLoadingConnectors = createAction('[Visibility] stopLoadingConnectors');

export const loadVisibilityData = createAction('[Visibility] LoadVisibilityData', props<{approvalInstanceId: number, connectorType: string}>());
export const fetchVisbilityData = createAction('[Visibility] FetchVisibilityData', props<{ visibilityData: any }>());


export const postReview = createAction('[Visibility] PostVisibilityReview', props<{approvalInstanceId: number, applicationId: number, postData:any}>());

export const fetchComments = createAction('[Visibility] FetchComments', props<{reviewComments:any}>());
// export const loadedRerunResults = createAction('[LogAnalysis] LoadedRerunResults');
// export const restrictExecutionOfServices = createAction('[Visibility] RestrictExecutionOfServices');

