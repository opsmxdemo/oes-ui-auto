
import { Action, createReducer, on } from '@ngrx/store';
import * as DataSourceAction from './data-source.actions';


export interface State {

    datasourceList: any;
    errorMessage: string;
    supportedDatasource: any;
    loadingDatasource: boolean;
    datasaved: boolean;
}

export const initialState: State = {
    errorMessage: null,
    datasourceList: null,
    supportedDatasource: null,
    loadingDatasource: false,
    datasaved: false
}

export function DataSourceReducer(
    dataSourceState: State | undefined,
    dataSourceAction: Action) {
    return createReducer(
        initialState,

        on(DataSourceAction.fetchDatasourceList,
            (state,action) => ({
                ...state,
                datasourceList: action.DatasourceList,
            })
        ),
        on(DataSourceAction.DatasourceaccountDeleted,
            (state,action) => ({
                ...state,
                datasourceList: state.datasourceList.filter((datasourceList,index) => index !== action.index)
            })
        ),
        on(DataSourceAction.errorOccured,
            (state,action) => ({
                ...state,
                erroeMessage:action.errorMessage,
                datasaved: false,
                loadingDatasource:true,
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

    )(dataSourceState,dataSourceAction);
}