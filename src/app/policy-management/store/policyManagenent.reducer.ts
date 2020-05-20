import { Action, createReducer, on } from '@ngrx/store';
import { PolicyTable } from 'src/app/models/policyManagement/policyTable.model';
import * as PolicyActions from './policyManagement.actions'
import { PolicyManagement } from 'src/app/models/policyManagement/policyManagement.model';

export interface State {
    dynamicTableData: PolicyTable[];
    staticTableData: PolicyTable[];
    endpointTypeData: any;
    errorMessage: string;
    editPolicyData:PolicyManagement;
    editMode:boolean;
    readonlyMode:boolean;
    loading:boolean;
}

export const initialState: State = {
    dynamicTableData: null,
    staticTableData: null,
    endpointTypeData: null,
    errorMessage: null,
    editPolicyData: null,
    editMode: false,
    readonlyMode: true,
    loading:false
}

export function PolicyReducer(
    policyState: State | undefined,
    policyActions: Action) {
    return createReducer(
        initialState,
        on(PolicyActions.loadTableData,
            (state, action) => ({
                ...state,
                dynamicTableData: action.TableData['dynamicPolicies'],
                staticTableData: action.TableData['staticPolicies'],
                loading:false
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
                errorMessage: action.errorMessage,
                readonlyMode:false,
                loading:false
            })
        ),
        on(PolicyActions.successfullSubmission,
            (state,action) => ({
                ...state,
                errorMessage: null,
                readonlyMode:true,
                editPolicyData:action.policyData
                
            })
        ),
        on(PolicyActions.editPolicy,
            (state,action) => ({
                ...state,
                editMode: action.editMode,
                readonlyMode: action.readonlyMode,
                loading:true
            })
        ),
        on(PolicyActions.fetchedPolicyData,
            (state,action) => ({
                ...state,
                editPolicyData: action.policyData,
                loading:false
            })
        ),
        on(PolicyActions.createPolicy,
            (state,action) => ({
                ...state,
                readonlyMode:false,
                editMode:false
            })
        ),
        on(PolicyActions.savePolicy,
            (state) => ({
                ...state,
                loading:true
            })
        ),
    )(policyState,policyActions);
}