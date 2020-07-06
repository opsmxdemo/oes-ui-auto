import { createAction, props } from '@ngrx/store';
import { PolicyManagement } from 'src/app/models/policyManagement/policyManagement.model';



export const loadPolicy = createAction('[Policy] LoadPolicy', props<{relatedTab}>());
export const errorOccured = createAction('[Policy] ErrorOccured', props<{errorMessage:string}>());
export const loadTableData = createAction('[Policy] LoadTableData', props<{TableData:any}>());
export const fetchEndpointType = createAction('[Policy] FetchEndpointType', props<{endpointType:any}>());
export const savePolicy = createAction('[Policy] SavePolicy', props<{policyForm:PolicyManagement,relatedTab:string}>());
export const editPolicy = createAction('[Policy] EditPolicy', props<{policyName:any,editMode:boolean,readonlyMode:boolean,relatedTab:string}>());
export const deletePolicy = createAction('[Policy] DeletePolicy', props<{policyName:string}>());
export const createPolicy = createAction('[Policy] CreatePolicy');
export const changeTab = createAction('[Policy] ChangeTab');
export const deletedPolicySuccessfully = createAction('[Policy] deletedPolicySuccessfully');
export const fetchedDynamicPolicyData = createAction('[Policy] FetchedDynamicPolicyData', props<{DynamicPolicyData:PolicyManagement}>());
export const fetchedStaticPolicyData = createAction('[Policy] FetchedSataticPolicyData', props<{StaticPolicyData:PolicyManagement}>());
export const dynamicPolicSuccessfullSubmission = createAction('[Policy] DynamicSavePolicy', props<{DynamicPolicyData:PolicyManagement,readonly:boolean,editMode:boolean,errorMode:boolean}>());
export const staticPolicySuccessfullSubmission = createAction('[Policy] StaticSavePolicy', props<{StaticPolicyData:PolicyManagement,readonly:boolean,editMode:boolean,errorMode:boolean}>());

