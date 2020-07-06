import { createAction, props } from '@ngrx/store';

export const loadCdDashboard = createAction('[CdDashboard] LoadCdDashboard');
export const errorOccured = createAction('[CdDashboard] ErrorOccured', props<{errorMessage:string}>());
export const fetchHealthChartData = createAction('[CdDashboard] FetchHealthChartData', props<{mainChartData: any}>());
export const fetchSubChartRawData = createAction('[CdDashboard] FetchSubChartRawData', props<{subChartRawData: any}>());