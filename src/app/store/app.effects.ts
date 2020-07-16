import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { AuthEffect } from '../auth/store/auth.effects';
import { LayoutEffect } from '../layout/store/layout.effects';
import { ApplicationOnBoardingEffect } from '../application-onboarding/store/onBoarding.effects';
import { AuditEffect } from '../audit/store/audit.effects';
import { PolicyEffect } from '../policy-management/store/policyManagement.effects';
import { AppDashboardEffect } from '../application/application-dashboard/store/dashboard.effects';
import { DeploymentVerificationEffect } from '../application/deployment-verification/store/deploymentverification.effects';
import { CdDashboardEffect } from '../cd-dashboard/store/cd-dashboard.effects';
import { MetricAnalysisEffect } from '../application/deployment-verification/metric-analysis/store/metric-analysis.effects';
import { LogAnalysisEffect } from '../application/deployment-verification/log-analysis/store/log-analysis.effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([
                          AuthEffect,
                          LayoutEffect,
                          ApplicationOnBoardingEffect,
                          AuditEffect,
                          PolicyEffect,
                          AppDashboardEffect,
                          DeploymentVerificationEffect,
                          CdDashboardEffect,
                          MetricAnalysisEffect,
                          LogAnalysisEffect
    ])
  ],
})
export class EffectModule {}