import { Action, createReducer, on } from '@ngrx/store';
import * as AccountsAction from './accounts.actions';

export interface State {
    
    accountList: any;
    accountParentPage: string;
    accountDeleted: boolean;
    errorMessage: string;
    isDynamicAccountLoaded: boolean;
    accountListData: any;
}

export const initialState: State = {
    errorMessage: null,
    accountList: null,
    accountParentPage: null,
    accountDeleted: false,
    isDynamicAccountLoaded: false,
    accountListData: null,
}

export function AccountsReducer(
    accountsState: State | undefined,
    accountsAction: Action) {
    return createReducer(
        initialState,
        // ###  Account screen logic Starts ### // 
        on(AccountsAction.fetchAccountList,
            (state,action) => ({
                ...state,
                accountList: action.Accountlist,
            })
        ),
        on(AccountsAction.loadAccount,
            (state, action) => ({
                ...state,
                accountParentPage: action.page
            })
        ),
        on(AccountsAction.deleteAccount,
            (state, action) => ({
                ...state,
                accountDeleted: false
            })
        ),
        on(AccountsAction.accountDeleted,
            (state,action) => ({
                ...state,
                accountList: state.accountList.filter((accountList,index) => index !== action.index)
            })
        ),
        on(AccountsAction.errorOccured,
            (state,action) => ({
                ...state,
                errorMessage:action.errorMessage
            })
        ),

        on(AccountsAction.updateDynamicAccount,
            (state,action) => ({
                ...state,
                accountListData:action.updatedAccountData,
                isDynamicAccountLoaded: false
            })
        ),
        on(AccountsAction.postUpdateDynamicAccount,
            (state,action) => ({
                ...state,
                accountListData:action.dynamicAccountListData,
                isDynamicAccountLoaded: true
            })
        ),
        on(AccountsAction.isDynamicAccountUpdated,
            (state,action) => ({
                ...state,
                isDynamicAccountLoaded: false
            })
        ),

    )(accountsState,accountsAction);
}