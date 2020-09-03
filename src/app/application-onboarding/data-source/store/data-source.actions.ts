import { createAction, props } from '@ngrx/store';
import { CreateDataSource } from 'src/app/models/applicationOnboarding/dataSourceModel/createDataSourceModel';

// Below action is related to datasources
export const loadDatasource = createAction('[Data-Source] LoadDatasource');
export const loadDatasourceList = createAction('[Data-Source] LoadDatasourceList');
export const fetchDatasourceList  = createAction('[Data-Source] FetchDatasourceList', props<{DatasourceList:any}>());
export const deleteDatasourceAccount = createAction('[Data-Source] DeleteDatasourceAccount', props<{accountName:any,index:number}>())
export const DatasourceaccountDeleted = createAction('[Data-Source] DatasourceAccountDeleted', props<{index:number}>());
export const errorOccured = createAction('[Data-Source] ErrorOccured', props<{errorMessage:string}>());
export const fetchSupportedDatasources = createAction('[Data-Source] FetchSupportedDatasources', props<{SupportedDataSource:any}>());
export const postAPDatasources = createAction('[Data-Source] PostAPDatasources', props<{CreatedDataSource:CreateDataSource}>());
export const postOESDatasources = createAction('[Data-Source] PostOESDatasources', props<{CreatedDataSource:CreateDataSource}>());
export const successResponse = createAction('[Data-Source] SuccessResponse');
