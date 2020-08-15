import { createAction, props } from '@ngrx/store';

// Below action is related to datasources
export const loadDatasourceList = createAction('[Data-Source] LoadDatasourceList');
export const fetchDatasourceList  = createAction('[Data-Source] FetchDatasourceList', props<{DatasourceList:any}>());
export const deleteDatasourceAccount = createAction('[Data-Source] DeleteDatasourceAccount', props<{accountName:any,index:number}>())
export const DatasourceaccountDeleted = createAction('[Data-Source] DatasourceAccountDeleted', props<{index:number}>());
export const errorOccured = createAction('[Data-Source] ErrorOccured', props<{errorMessage:string}>());
