import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MetricAnalysisComponent } from './metric-analysis/metric-analysis.component';
import { LogAnalysisComponent } from './log-analysis/log-analysis.component';
import { DeploymentVerificationComponent } from './deployment-verification.component';
import * as fromdeploymentVarification from './store/feature.reducer'
import { AppMaterialModule } from 'src/app/subModules/app-material.module';
import { ChartsModule } from 'src/app/subModules/charts.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DeploymentVerificationEffect } from './store/deploymentverification.effects';
import { MetricAnalysisEffect } from './metric-analysis/store/metric-analysis.effects';
import { LogAnalysisEffect } from './log-analysis/store/log-analysis.effects';

@NgModule({
    declarations: [
        DeploymentVerificationComponent,
        MetricAnalysisComponent,
        LogAnalysisComponent,
    ],
    imports: [
     CommonModule,
     ReactiveFormsModule,
     FormsModule,
     HttpClientModule,
     AppMaterialModule,
     ChartsModule,
     NgxChartsModule,
     Ng2SearchPipeModule,
     StoreModule.forFeature('deploymentVerification',fromdeploymentVarification.deploymentVerificationReducers),
     EffectsModule.forFeature([
        DeploymentVerificationEffect,
        MetricAnalysisEffect,
        LogAnalysisEffect
     ])
    ],
  })
  export class DeploymentVerificationModule { }
  