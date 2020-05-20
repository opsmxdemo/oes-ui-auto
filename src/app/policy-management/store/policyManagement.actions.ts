import { createAction, props } from '@ngrx/store';
import { PolicyManagement } from 'src/app/models/policyManagement/policyManagement.model';



export const loadPolicy = createAction('[Policy] LoadPolicy', props<{relatedTab}>());
export const errorOccured = createAction('[Audit] ErrorOccured', props<{errorMessage:string}>());
export const loadTableData = createAction('[Policy] LoadTableData', props<{TableData:any}>());
export const fetchEndpointType = createAction('[Policy] FetchEndpointType', props<{endpointType:any}>());
export const savePolicy = createAction('[Policy] SavePolicy', props<{policyForm:PolicyManagement}>());
export const successfullSubmission = createAction('[Policy] SavePolicy', props<{policyData:PolicyManagement}>());
export const editPolicy = createAction('[Policy] EditPolicy', props<{policyName:any,editMode:boolean,readonlyMode:boolean}>());
export const fetchedPolicyData = createAction('[Policy] fetchedPolicyData', props<{policyData:PolicyManagement}>());
export const deletePolicy = createAction('[Policy] DeletePolicy', props<{policydatatoshow:PolicyManagement, policyName:string}>());
export const createPolicy = createAction('[Policy] CreatePolicy');

