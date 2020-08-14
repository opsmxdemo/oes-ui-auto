import { createAction, props } from '@ngrx/store';


export const loadAppDashboard = createAction('[AppDashboaed] LoadAppDashboard');
export const errorOccured = createAction('[AppDashboaed] ErrorOccured', props<{errorMessage:string}>());
export const fetchedAppData = createAction('[AppDashboaed] FetchedAppData', props<{appData:any}>());
export const fetchNetworkChartData = createAction('[AppDashboaed] FetchNetworkChartData', props<{networkChartData: any}>());

