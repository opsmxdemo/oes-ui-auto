import {ActionReducerMap} from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromLayout from '../layout/store/layout.reducer';
import * as fromAppOnboarding from '../application-onboarding/store/onBoarding.reducer';
import * as fromAudit from '../audit/store/audit.reducer';

export interface AppState {
    auth: fromAuth.State;
    layout: fromLayout.State;
    appOnboarding: fromAppOnboarding.State;
    audit: fromAudit.State
}

export const appReducers: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    layout: fromLayout.layoutReducer,
    appOnboarding: fromAppOnboarding.AppOnboardingReducer,
    audit: fromAudit.AuditReducer
};
