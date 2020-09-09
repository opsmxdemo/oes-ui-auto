import { createAction, props } from '@ngrx/store';


export const loadAppDashboard = createAction('[AppDashboaed] LoadAppDashboard');
export const errorOccured = createAction('[AppDashboaed] ErrorOccured', props<{errorMessage:any}>());
export const fetchedAppData = createAction('[AppDashboaed] FetchedAppData', props<{appData:any}>());
export const fetchNetworkChartData = createAction('[AppDashboaed] FetchNetworkChartData', props<{networkChartData: any}>());
export const deleteApplication = createAction('[AppDashboaed] DeleteApplication',props<{applicationId:any,index:number}>())
export const applicationDeleted = createAction('[AppDashboaed] AplicationDeleted', props<{index:number}>());


