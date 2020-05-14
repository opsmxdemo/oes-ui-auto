import { Action, createReducer, on } from '@ngrx/store';
import { PolicyTable } from 'src/app/models/policyManagement/policyTable.model';
import * as PolicyActions from './policyManagement.actions'

export interface State {
    dynamicTableData: PolicyTable[];
    staticTableData: PolicyTable[];
    endpointTypeData: any;
    errorMessage: string;
}

export const initialState: State = {
    dynamicTableData: null,
    staticTableData: null,
    endpointTypeData: null,
    errorMessage: null
}

export function PolicyReducer(
    policyState: State | undefined,
    policyActions: Action) {
    return createReducer(
        initialState,
        on(PolicyActions.loadTableData,
            (state, action) => ({
                ...state,
                dynamicTableData: action.TableData['dynamicTable'],
                staticTableData: action.TableData['staticTable'],
            })
        ),
        on(PolicyActions.fetchEndpointType,
            (state, action) => ({
                ...state,
                endpointTypeData: action.endpointType
            })
        ),
        on(PolicyActions.errorOccured,
            (state, action) => ({
                ...state,
                errorMessage: action.errorMessage
            })
        ),
        on(PolicyActions.successfullSubmission,
            state => ({
                ...state,
                errorMessage: null
            })
        ),
    )(policyState,policyActions);
}