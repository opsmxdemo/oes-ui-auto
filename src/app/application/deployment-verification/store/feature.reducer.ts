import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromDeployVerification from './deploymentverification.reducer';
import * as fromMetricAnalysis from '../metric-analysis/store/metric-analysis.reducer';
import * as fromLogAnalysis from '../log-analysis/store/log-analysis.reducer';
import * as fromApp from '../../../store/app.reducer';
import * as fromCorrelation from '../correlation/store/correlation.reducer';


export interface DeploymentVerificationState {
    deploymentVerification: fromDeployVerification.State;
    metricAnalysis: fromMetricAnalysis.State;
    logAnalysis: fromLogAnalysis.State;
    correlation: fromCorrelation.State;
}

export interface State extends fromApp.AppState {
    deploymentVerification:DeploymentVerificationState;
}

export const deploymentVerificationReducers: ActionReducerMap<DeploymentVerificationState> = {
    deploymentVerification: fromDeployVerification.DeploymentdReducer,
    metricAnalysis: fromMetricAnalysis.MetricAnalysisReducer,
    logAnalysis: fromLogAnalysis.LogAnalysisReducer,
    correlation: fromCorrelation.CorrelationReducer
};

export const selectFeatureState = createFeatureSelector<DeploymentVerificationState>('deploymentVerification');
export const selectMetricAnalysisState = createSelector(selectFeatureState,(state) => state.metricAnalysis);
export const selectLogAnalysisState = createSelector(selectFeatureState,(state) => state.logAnalysis);
export const selectDeploymentVerificationState = createSelector(selectFeatureState,(state) => state.deploymentVerification);
export const selectCorrelationState = createSelector(selectFeatureState,(state) => state.correlation);
