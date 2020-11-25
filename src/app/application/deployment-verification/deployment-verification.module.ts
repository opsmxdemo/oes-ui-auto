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
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DeploymentVerificationEffect } from './store/deploymentverification.effects';
import { MetricAnalysisEffect } from './metric-analysis/store/metric-analysis.effects';
import { LogAnalysisEffect } from './log-analysis/store/log-analysis.effects';
import { ReplaceLineBreaks } from '../../pipes/keys.pipe';
import { ChildTableComponent } from './metric-analysis/child-table/child-table.component';
import { SharedModule } from 'src/app/subModules/shared.module';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from "fusioncharts";
import * as charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { NgpSortModule } from "ngp-sort-pipe";

import { ChangetextcolorPipe } from '../../pipes/keys.pipe';
import { ChangeTImestamptotimePipe } from '../../pipes/keys.pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { NgJsonEditorModule } from "ang-jsoneditor";
import { CorrelationComponent } from './correlation/correlation.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CorrelationformComponent } from './correlation/correlationform/correlationform.component';
import { CorrelationformdetailsComponent } from './correlation/correlationform/correlationformdetails/correlationformdetails.component';
import { CorrelationEffect } from './correlation/store/correlation.effects';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';


FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);
FusionCharts.options["license"]({
    key: "RjD2fA-21qC3E4A1A4F4H3C7C9B6B1D4F5poiB9D2A7iC4B4A3I-8J-7jA5C5B3tpgI2D1A4tllE2B4G1A2E2B6C5A3E6D4C4ckeC8D5PF4kmA-8D2G1B6ue1C2KC1C1I-8I-7oB1E6B1B3H3E2A14A19A6C5C6D3A1G4w==",
    creditLabel: false,
    })
@NgModule({
    declarations: [
        DeploymentVerificationComponent,
        MetricAnalysisComponent,
        LogAnalysisComponent,
        ReplaceLineBreaks,
        ChildTableComponent,
        
        ChangetextcolorPipe,
        ChangeTImestamptotimePipe,
        CorrelationComponent,
        CorrelationformComponent,
        CorrelationformdetailsComponent,
    ],
    imports: [
     CommonModule,
     FusionChartsModule,
     ReactiveFormsModule,
     FormsModule,
     ClipboardModule,
     HttpClientModule,
     NgpSortModule,
     AppMaterialModule,
     ChartsModule,
     FusionChartsModule,
     Ng2SearchPipeModule,
     NgJsonEditorModule,
     ModalModule.forRoot(),
     SharedModule,
     StoreModule.forFeature('deploymentVerification',fromdeploymentVarification.deploymentVerificationReducers),
     EffectsModule.forFeature([
        DeploymentVerificationEffect,
        MetricAnalysisEffect,
        LogAnalysisEffect,
        CorrelationEffect
     ]),
     NgxMatDatetimePickerModule,
     NgxMatTimepickerModule,
     NgxMatNativeDateModule, 
     NgxMatMomentModule 
    ],
  })
  export class DeploymentVerificationModule { }
  
