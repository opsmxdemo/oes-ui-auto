import { createAction, props } from '@ngrx/store';
import { CreateDataSource } from 'src/app/models/applicationOnboarding/dataSourceModel/createDataSourceModel';

// Below action is related to datasources
export const loadDatasource = createAction('[Data-Source] LoadDatasource');
export const errorOccured = createAction('[Data-Source] ErrorOccured', props<{errorMessage:string}>());
export const fetchSupportedDatasources = createAction('[Data-Source] FetchSupportedDatasources', props<{SupportedDataSource:any}>());
export const postAPDatasources = createAction('[Data-Source] PostAPDatasources', props<{CreatedDataSource:CreateDataSource}>());
export const postOESDatasources = createAction('[Data-Source] PostOESDatasources', props<{CreatedDataSource:CreateDataSource}>());
export const successResponse = createAction('[Data-Source] SuccessResponse');

// Below action is related to datasource list
export const loadDatasourceList = createAction('[Data-Source] LoadDatasourceList');
export const fetchDatasourceList  = createAction('[Data-Source] FetchDatasourceList', props<{DatasourceList:any}>());
export const DatasourceaccountDeleted = createAction('[Data-Source] DatasourceAccountDeleted', props<{index:number}>());
export const listErrorOccured = createAction('[Data-Source] ListErrorOccured', props<{errorMessage:string}>());
export const deleteAPDatasourceAccount = createAction('[Data-Source] DeleteAPDatasourceAccount', props<{accountName:any,id:number}>())
export const deleteOESDatasourceAccount = createAction('[Data-Source] DeleteOESDatasourceAccount', props<{accountName:any,index:number}>())