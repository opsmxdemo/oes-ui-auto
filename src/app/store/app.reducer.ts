import {ActionReducerMap} from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromLayout from '../layout/store/layout.reducer';
import * as fromAppOnboarding from '../application-onboarding/store/onBoarding.reducer';
import * as fromAudit from '../audit/store/audit.reducer';
import * as fromPolicy from '../policy-management/store/policyManagenent.reducer';
import * as fromCdDashboard from '../cd-dashboard/store/cd-dashboard.reducer';
import * as fromAppDashboard from '../application/application-dashboard/store/dashboard.reducer';
import * as fromDeploymentVerification from '../application/deployment-verification/store/deploymentverification.reducer';
import * as fromLogAnalysis from '../application/deployment-verification/log-analysis/store/log-analysis.reducer';

export interface AppState {
    auth: fromAuth.State;
    layout: fromLayout.State;
    appOnboarding: fromAppOnboarding.State;
    audit: fromAudit.State;
    policy: fromPolicy.State;
    appDashboard: fromAppDashboard.State;
    deploymentOnboarding: fromDeploymentVerification.State;
    cdDashboard: fromCdDashboard.State;
    logAnalysis: fromLogAnalysis.State;
}

export const appReducers: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    layout: fromLayout.layoutReducer,
    appOnboarding: fromAppOnboarding.AppOnboardingReducer,
    audit: fromAudit.AuditReducer,
    policy: fromPolicy.PolicyReducer,
    appDashboard: fromAppDashboard.DashboardReducer,
    deploymentOnboarding: fromDeploymentVerification.DeploymentdReducer,
    cdDashboard: fromCdDashboard.CdDashboardReducer,
    logAnalysis: fromLogAnalysis.LogAnalysisReducer
};
