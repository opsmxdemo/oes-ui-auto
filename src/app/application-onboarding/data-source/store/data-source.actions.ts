import { createAction, props } from '@ngrx/store';
import { CreateDataSource } from 'src/app/models/applicationOnboarding/dataSourceModel/createDataSourceModel';
import { EditDataSource } from 'src/app/models/applicationOnboarding/dataSourceModel/editDataSourceModel';

// Below action is related to datasources
export const loadDatasource = createAction('[Data-Source] LoadDatasource');
export const errorOccured = createAction('[Data-Source] ErrorOccured', props<{errorMessage:string}>());
export const fetchSupportedDatasources = createAction('[Data-Source] FetchSupportedDatasources', props<{SupportedDataSource:any}>());
export const createAPDatasources = createAction('[Data-Source] CreateAPDatasources', props<{CreatedDataSource:CreateDataSource}>());
export const createOESDatasources = createAction('[Data-Source] CreateOESDatasources', props<{CreatedDataSource:CreateDataSource}>());
export const successResponse = createAction('[Data-Source] SuccessResponse');

// Below action is related to update Datasource
export const updateAPDatasources = createAction('[Data-Source] UpdateAPDatasources', props<{UpdatedDataSource:EditDataSource}>());
export const updateOESDatasources = createAction('[Data-Source] UpdateOESDatasources', props<{UpdatedDataSource:EditDataSource}>());
export const updatesuccessResponse = createAction('[Data-Source] UpdateSuccessResponse');

// Below action is related to datasource list
export const loadDatasourceList = createAction('[Data-Source] LoadDatasourceList');
export const loadOESDatasourceList = createAction('[Data-Source] LoadOESDatasourceList');
export const loadAPDatasourceList = createAction('[Data-Source] LoadAPDatasourceList');
export const fetchDatasourceList  = createAction('[Data-Source] FetchDatasourceList', props<{DatasourceList:any}>());
export const DatasourceaccountDeleted = createAction('[Data-Source] DatasourceAccountDeleted', props<{index:number}>());
export const listErrorOccured = createAction('[Data-Source] ListErrorOccured', props<{errorMessage:string}>());
export const deleteAPDatasourceAccount = createAction('[Data-Source] DeleteAPDatasourceAccount', props<{accountName:any,id:number,index:number}>())
export const deleteOESDatasourceAccount = createAction('[Data-Source] DeleteOESDatasourceAccount', props<{accountName:any,index:number}>())