import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as fromApplication from '../application/store/application.reducer';
import * as fromAccounts from '../accounts/store/accounts.reducer';
import * as fromDataSource from '../data-source/store/data-source.reducer';


export interface ApplicationOnboardingState {
    application: fromApplication.State;
    accounts: fromAccounts.State;
    dataSource: fromDataSource.State;
}

export interface State extends fromApp.AppState {
    applicationOnboarding:ApplicationOnboardingState;
}

export const applicationOnboardingReducers: ActionReducerMap<ApplicationOnboardingState> = {
    application: fromApplication.ApplicationReducer,
    accounts: fromAccounts.AccountsReducer,
    dataSource: fromDataSource.DataSourceReducer
};

export const selectFeatureState = createFeatureSelector<ApplicationOnboardingState>('applicationOnboarding');
export const selectApplication = createSelector(selectFeatureState,(state) => state.application);
export const selectAccounts = createSelector(selectFeatureState,(state) => state.accounts);
export const selectDataSource = createSelector(selectFeatureState,(state) => state.dataSource);
