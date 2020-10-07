import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics

export const loadLogResults = createAction('[LogAnalysis] LoadLogResults', props<{canaryId: any,serviceId: any}>());
export const errorOccured = createAction('[LogAnalysis] ErrorOccured', props<{errorMessage:string}>());
export const fetchLogsResults = createAction('[LogAnalysis] FetchLogsResults', props<{logsResults:any}>());
export const loadedLogResults = createAction('[LogAnalysis] loadedLogResults');

export const loadEventLogResults = createAction('[LogAnalysis] LoadEventLogResults', props<{canaryId: any,serviceId: any,event:any}>());
export const fetchEventLogsResults = createAction('[LogAnalysis] FetchEventLogsResults', props<{logsEventResults:any}>());
export const loadedEventsLogs = createAction('[LogAnalysis] LoadedEventsLogs');

export const rerunLogs = createAction('[LogAnalysis] ReRunLogs', props<{logTemplate:any, canaryId: any,serviceId: any,postData:any}>())
export const fetchRerunLogsResults = createAction('[LogAnalysis] FetchRerunLogsResults', props<{rerunResponse:any}>());
export const loadedRerunResults = createAction('[LogAnalysis] LoadedRerunResults');

export const fetchClusterLogData = createAction('[LogAnalysis] FetchClusterLogData', props<{canaryId: any,serviceId: any,clusterId:any, version:any}>());
export const loadClusterLogData = createAction('[LogAnalysis] LoadClusterLogData', props<{clusterLogs:any}>());
export const loadedClusterLogData = createAction('[LogAnalysis] LoadedClusterLogData');

export const fetchTimeAnalysisGraphData = createAction('[LogAnalysis] FetchTimeAnalysisGraphData', props<{canaryId:any,serviceId: any,clusterId: any;version:any;}>());
export const loadTimeAnalysisGraphData = createAction('[LogAnalysis] LoadTimeAnalysisGraphData', props<{logTimeAnalysisResults:any}>());

export const loadLogTopics = createAction('[LogAnalysis] LoadLogTopics');
export const fetchLogTopics = createAction('[LogAnalysis] FetchLogTopics', props<{ logslist: [] }>());

export const reloadAfterRerun = createAction('[LogAnalysis] ReloadAfterRerun', props<{canaryId: any,serviceId: any}>())

export const fetchReclassificationHistoryData = createAction('[LogAnalysis] FetchReclassificationHistoryData', props<{logTemplateName: any;}>());
export const loadReclassificationHistoryData = createAction('[LogAnalysis] loadReclassificationHistoryData', props<{reclassificationHistoryResults:any}>());


