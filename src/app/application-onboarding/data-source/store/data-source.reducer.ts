
import { Action, createReducer, on } from '@ngrx/store';
import * as DataSourceAction from './data-source.actions';


export interface State {
   
    errorMessage: string;
    supportedDatasource: any;
    loadingDatasource: boolean;
    datasaved: boolean;
    // Below is datasource list properties
    datasourceList: any[];
    listLoading: boolean;
}

export const initialState: State = {
    errorMessage: null,
    supportedDatasource: null,
    loadingDatasource: false,
    datasaved: false,
    datasourceList: [],
    listLoading: false
}

export function DataSourceReducer(
    dataSourceState: State | undefined,
    dataSourceAction: Action) {
    return createReducer(
        initialState,
        on(DataSourceAction.errorOccured,
            (state,action) => ({
                ...state,
                erroeMessage:action.errorMessage,
                datasaved: false,
                loadingDatasource:false,
            })
        ),
        on(DataSourceAction.fetchSupportedDatasources,
            (state,action) => ({
                ...state,
                supportedDatasource:action.SupportedDataSource 
            })
        ),
        on(DataSourceAction.postAPDatasources,
            (state,action) => ({
                ...state,
                loadingDatasource:true,
                erroeMessage:null,
                datasaved:false 
            })
        ),
        on(DataSourceAction.postOESDatasources,
            (state,action) => ({
                ...state,
                loadingDatasource:true,
                erroeMessage:null,
                datasaved:false 
            })
        ),
        on(DataSourceAction.successResponse,
            (state,action) => ({
                ...state,
                loadingDatasource:false,
                erroeMessage:null,
                datasaved:true
            })
        ),

        // Datasource list code start
        on(DataSourceAction.loadDatasourceList,
            (state,action) => ({
                ...state,
                listLoading: true,
                datasourceList:[]
            })
        ),
        on(DataSourceAction.listErrorOccured,
            (state,action) => ({
                ...state,
                listLoading: false
            })
        ),
        on(DataSourceAction.fetchDatasourceList,
            (state,action) => ({
                ...state,
                datasourceList: state.datasourceList.concat( ...action.DatasourceList ),
                listLoading: false,
            })
        ),
        on(DataSourceAction.deleteOESDatasourceAccount,
            (state,action) => ({
                ...state,
                listLoading: true
            })
        ),
        on(DataSourceAction.deleteAPDatasourceAccount,
            (state,action) => ({
                ...state,
                listLoading: true
            })
        ),
        on(DataSourceAction.DatasourceaccountDeleted,
            (state,action) => ({
                ...state,
                listLoading: false,
                datasourceList: state.datasourceList.filter((datasourceList,index) => index !== action.index)
            })
        ),

    )(dataSourceState,dataSourceAction);
}