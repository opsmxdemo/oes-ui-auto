import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics
export const errorOccured = createAction('[Visibility] ErrorOccured', props<{ errorMessage: string }>());

export const loadApplications = createAction('[Visibility] LoadApplications');
export const fetchApplications = createAction('[Visibility] FetchApplications', props<{ applicationList: any }>());

export const loadServices = createAction('[Visibility] LoadServices');
export const fetchServices = createAction('[Visibility] FetchServices', props<{ servicesList: any }>());

export const loadToolConnectors = createAction('[Visibility] LoadToolConnectors');
export const fetchToolConnectors = createAction('[Visibility] FetchToolConnectors', props<{ toolConnectors: any }>());

export const loadVisibilityData = createAction('[Visibility] LoadVisibilityData');
export const fetchVisbilityData = createAction('[Visibility] FetchVisibilityData', props<{ visibilityData: any }>());

// export const restrictExecutionOfServices = createAction('[Visibility] RestrictExecutionOfServices');

