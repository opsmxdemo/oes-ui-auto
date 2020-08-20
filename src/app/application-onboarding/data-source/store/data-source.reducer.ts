
import { Action, createReducer, on } from '@ngrx/store';
import * as DataSourceAction from './data-source.actions';


export interface State {

    datasourceList: any;
    errorMessage: string;
    supportedDatasource: any;
    
}

export const initialState: State = {
    errorMessage: null,
    datasourceList: null,
    supportedDatasource: null
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
                erroeMessage:action.errorMessage
            })
        ),
        on(DataSourceAction.fetchSupportedDatasources,
            (state,action) => ({
                ...state,
                supportedDatasource:action.SupportedDataSource 
            })
        ),

    )(dataSourceState,dataSourceAction);
}