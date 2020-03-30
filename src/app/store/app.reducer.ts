import {ActionReducerMap} from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromLayout from '../layout/store/layout.reducer';

export interface AppState {
    auth: fromAuth.State;
    layout: fromLayout.State;
}

export const appReducers: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    layout: fromLayout.layoutReducer
};
