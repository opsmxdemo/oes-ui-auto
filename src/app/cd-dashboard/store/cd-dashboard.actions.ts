import { createAction, props } from '@ngrx/store';

export const loadCdDashboard = createAction('[CdDashboard] LoadCdDashboard');
export const errorOccured = createAction('[CdDashboard] ErrorOccured', props<{errorMessage:string}>());
export const fetchHealthChartData = createAction('[CdDashboard] FetchHealthChartData', props<{mainChartData: any}>());
export const fetchSubChartRawData = createAction('[CdDashboard] FetchSubChartRawData', props<{widgetRawData: any}>());
export const loadSubChartData = createAction('[CdDashboard] LoadSubChartData', props<{subChartId: number, index:number}>());
export const fetchSubChartData = createAction('[CdDashboard] LoadSubChartData', props<{subChartData: number, index:number}>());