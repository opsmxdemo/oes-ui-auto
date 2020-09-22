import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics

export const loadLogResults = createAction('[LogAnalysis] LoadLogResults', props<{canaryId: any,serviceId: any}>());
export const errorOccured = createAction('[LogAnalysis] ErrorOccured', props<{errorMessage:string}>());
export const fetchLogsResults = createAction('[LogAnalysis] FetchLogsResults', props<{logsResults:any}>());

export const fetchUnxepectedClusters = createAction('[Correlation] FetchUnxepectedClusters', props<{canaryId: any,serviceId: any}>());
export const loadUnxepectedClusters = createAction('[Correlation] LoadUnxepectedClusters', props<{unexpectedClusters:any}>());

export const fetchLogLines = createAction('[Correlation] FetchLogLines', props<{canaryId: any,serviceId: any,clusterId:any}>());
export const loadLogLines = createAction('[Correlation] LoadLogLines', props<{logLines:any}>());
