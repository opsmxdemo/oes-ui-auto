import { createAction, props } from '@ngrx/store';

// Below action related to Account
export const loadAccount = createAction('[Accounts] LoadAccount' , props<{page:string}>());
export const createAccount = createAction('[Accounts] createAccount', props<{accountData:any,postData:any}>())
export const updateAccount = createAction('[Accounts] updateAccount', props<{postData:any}>())
export const accountDataSaved = createAction('[Accounts] AccountDataSaved');
export const errorOccured = createAction('[Accounts] ErrorOccured', props<{errorMessage:string}>());

// Below action is related to accounts list
export const loadAccountList = createAction('[Accounts] LoadAccountList');
export const fetchAccountList = createAction('[Accounts] FetchAccountList', props<{Accountlist: any}>());
export const deleteAccount = createAction('[Accounts] DeleteAccount', props<{accountName:any,index:number}>())
export const accountDeleted = createAction('[Accounts] AccountDeleted', props<{index:number}>());
//export const accountDeletedSuccessfully = createAction('[Accounts] AccountDeletedSuccessfully', props<{index:number}>());


export const updateDynamicAccount = createAction('[Accounts] UpdateDynamicAccount', props<{updatedAccountData: any}>());
export const postUpdateDynamicAccount = createAction('[Accounts] PostUpdateDynamicAccount', props<{dynamicAccountListData: any}>());
export const isDynamicAccountUpdated = createAction('[Accounts] IsDynamicAccountUpdated');
