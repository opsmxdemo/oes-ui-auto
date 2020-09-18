import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as fromApplication from '../application/store/application.reducer';
import * as fromAccounts from '../accounts/store/accounts.reducer';
import * as fromDataSource from '../data-source/store/data-source.reducer';
import * as fromMetricTemplate from '../application/application-creation/metric-template/store/metricTemplate.reducer';
import * as fromLogTemplate from '../application/application-creation/log-template/store/logTemplate.reducer';


export interface ApplicationOnboardingState {
    application: fromApplication.State;
    accounts: fromAccounts.State;
    dataSource: fromDataSource.State;
    metricTemplate: fromMetricTemplate.State;
    logTemplate: fromLogTemplate.State;
}

export interface State extends fromApp.AppState {
    applicationOnboarding:ApplicationOnboardingState;
}

export const applicationOnboardingReducers: ActionReducerMap<ApplicationOnboardingState> = {
    application: fromApplication.ApplicationReducer,
    accounts: fromAccounts.AccountsReducer,
    dataSource: fromDataSource.DataSourceReducer,
    metricTemplate: fromMetricTemplate.MetricTemplateReducer,
    logTemplate: fromLogTemplate.LogTemplateReducer
};

export const selectFeatureState = createFeatureSelector<ApplicationOnboardingState>('applicationOnboarding');
export const selectApplication = createSelector(selectFeatureState,(state) => state.application);
export const selectAccounts = createSelector(selectFeatureState,(state) => state.accounts);
export const selectDataSource = createSelector(selectFeatureState,(state) => state.dataSource);
export const selectMetricTemplate = createSelector(selectFeatureState,(state)=> state.metricTemplate);
export const selectLogTemplate = createSelector(selectFeatureState,(state)=> state.logTemplate)
