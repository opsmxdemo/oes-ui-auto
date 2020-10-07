import { createAction, props } from '@ngrx/store';

// actions related to deployement verification common display of logs and metrics

export const loadLogResults = createAction('[LogAnalysis] LoadLogResults', props<{canaryId: any,serviceId: any}>());
export const errorOccured = createAction('[LogAnalysis] ErrorOccured', props<{errorMessage:string}>());
export const fetchLogsResults = createAction('[LogAnalysis] FetchLogsResults', props<{logsResults:any}>());

export const fetchUnxepectedClusters = createAction('[Correlation] FetchUnxepectedClusters', props<{canaryId: any,serviceId: any}>());
export const loadUnxepectedClusters = createAction('[Correlation] LoadUnxepectedClusters', props<{unexpectedClusters:any}>());

export const fetchLogLines = createAction('[Correlation] FetchLogLines', props<{canaryId: any,serviceId: any}>());
export const loadLogLines = createAction('[Correlation] LoadLogLines', props<{logLines:any}>());

export const timeSeriesData = createAction('[Correlation] TimeSeriesData', props<{postData:any}>())
export const loadTimeseriesData = createAction('[LogAnalysis] LoadTimeseriesData', props<{timeSeriesData:any}>());

export const clusterData = createAction('[Correlation] ClusterData', props<{canaryId: any,serviceId: any,clusterId:any,ClickedTimeStamp:any;}>());
export const loadCluterData = createAction('[Correlation] loadCluterData', props<{clusterData:any}>());
export const clusterDataLoaded = createAction('[Correlation] ClusterDataLoaded');

export const allMetrics = createAction('[Correlation] AllMetrics', props<{canaryId: any,serviceId: any}>());
export const loadallMetrics = createAction('[Correlation] LoadallMetrics', props<{allMetricsData:any}>());

export const metrictimeSeriesData = createAction('[Correlation] MetricTimeSeriesData', props<{postData:any}>())
export const metricloadTimeseriesData = createAction('[LogAnalysis] MetricLoadTimeseriesData', props<{metrictimeSeriesData:any}>());



