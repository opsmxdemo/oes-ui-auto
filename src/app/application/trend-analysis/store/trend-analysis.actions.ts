import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics
export const loadDeploymentApp = createAction('[TrendAnalysis] LoadDeploymentApp', props<{ page: string }>());

export const loadLatestRun = createAction('[TrendAnalysis] LoadLatestRun');
export const errorOccured = createAction('[TrendAnalysis] ErrorOccured', props<{ errorMessage: string }>());
export const fetchLatestRun = createAction('[TrendAnalysis] FetchLatestRun', props<{ canaryId: string[] }>());
export const updateCanaryRun = createAction('[TrendAnalysis] UpdateCanaryRun', props<{ canaryId: any }>());

export const loadApplications = createAction('[TrendAnalysis] LoadApplications');
export const fetchApplications = createAction('[TrendAnalysis] FetchApplications', props<{ applicationList: any }>());

export const loadServices = createAction('[TrendAnalysis] LoadServices', props<{ canaryId: any }>());
export const fetchServices = createAction('[TrendAnalysis] FetchServices', props<{ servicesList: any }>());
export const restrictExecutionOfServices = createAction('[TrendAnalysis] RestrictExecutionOfServices');

export const loadApplicationHelath = createAction('[TrendAnalysis] LoadApplicationHelath', props<{ canaryId: any }>());
export const fetchApplicationHelath = createAction('[TrendAnalysis] FetchApplicationHelath', props<{ applicationHealthDetails: any }>());

export const loadServiceInformation = createAction('[TrendAnalysis] LoadServiceInformation', props<{ canaryId: any, serviceId: number }>());
export const fetchServiceInformation = createAction('[TrendAnalysis] FetchServiceInformation', props<{ serviceSummary: any }>());

export const loadApplicationData = createAction('[TrendAnalysis] LoadApplicationData', props<{ applicationId: number, startTime: number, endTime: number }>());
export const fetchApplicationData = createAction('[TrendAnalysis] FetchApplicationData', props<{ applicationAndServiceList: any }>());

export const loadServiceTrendLogs = createAction('[TrendAnalysis] LoadServiceTrendLogs', props<{ applicationId: number, startTime: number, endTime: number, serviceId: number }>());
export const fetchServiceTrendLogs = createAction('[TrendAnalysis] FetchServiceTrendLogs', props<{ issuesLogsData: any }>());
