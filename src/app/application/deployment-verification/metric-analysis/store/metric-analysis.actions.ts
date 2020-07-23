import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics

export const loadMetricAnalysis = createAction('[MetricAnalysis] LoadMetricAnalysis',props<{canaryId:string,serviceId:number}>());
export const errorOccured = createAction('[MetricAnalysis] ErrorOccured', props<{errorMessage:string}>());
export const fetchCanaryOutput = createAction('[MetricAnalysis] FetchCanaryOutput', props<{cararyData:any}>());
