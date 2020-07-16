import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics

export const loadLogResults = createAction('[LogAnalysis] LoadLogResults');
export const errorOccured = createAction('[LogAnalysis] ErrorOccured', props<{errorMessage:string}>());
export const fetchLogsResults = createAction('[LogAnalysis] FetchLogsResults', props<{logsResults:any}>());

