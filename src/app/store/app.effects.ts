import { TrendAnalysisEffect } from './../application/trend-analysis/store/trend-analysis.effects';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { AuthEffect } from '../auth/store/auth.effects';
import { LayoutEffect } from '../layout/store/layout.effects';
import { AuditEffect } from '../audit/store/audit.effects';
import { PolicyEffect } from '../policy-management/store/policyManagement.effects';
import { AppDashboardEffect } from '../application/application-dashboard/store/dashboard.effects';
import { DeploymentVerificationEffect } from '../application/deployment-verification/store/deploymentverification.effects';
import { CdDashboardEffect } from '../cd-dashboard/store/cd-dashboard.effects';


@NgModule({
  imports: [
    EffectsModule.forRoot([
                          AuthEffect,
                          LayoutEffect,
                          AuditEffect,
                          PolicyEffect,
                          AppDashboardEffect,
                          DeploymentVerificationEffect,
                          CdDashboardEffect,
                          TrendAnalysisEffect
    ])
  ],
})
export class EffectModule {}