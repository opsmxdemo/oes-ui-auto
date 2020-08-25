import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics

export const loadLogResults = createAction('[LogAnalysis] LoadLogResults', props<{canaryId: any,serviceId: any}>());
export const errorOccured = createAction('[LogAnalysis] ErrorOccured', props<{errorMessage:string}>());
export const fetchLogsResults = createAction('[LogAnalysis] FetchLogsResults', props<{logsResults:any}>());

export const loadEventLogResults = createAction('[LogAnalysis] LoadEventLogResults', props<{canaryId: any,serviceId: any,event:any}>());
export const fetchEventLogsResults = createAction('[LogAnalysis] FetchEventLogsResults', props<{logsEventResults:any}>());


export const rerunLogs = createAction('[LogAnalysis] ReRunLogs', props<{logTemplate:any, canaryId: any,serviceId: any,postData:any}>())
export const fetchRerunLogsResults = createAction('[LogAnalysis] FetchRerunLogsResults', props<{rerunResponse:any}>());



