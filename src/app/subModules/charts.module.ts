import { StackedAreaChartComponent } from './../charts/stacked-area-chart/stacked-area-chart.component';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { CommonModule } from '@angular/common';
import { AreaChartComponent } from '../charts/area-chart/area-chart.component';
import { HorizontalBarChartComponent } from '../charts/horizontal-bar-chart/horizontal-bar-chart.component';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { StacketHorizontalBarChartComponent } from '../charts/stacket-horizontal-bar-chart/stacket-horizontal-bar-chart.component';
import { LineChartComponent } from '../charts/line-chart/line-chart.component';
import { BubbleChartComponent } from '../charts/bubble-chart/bubble-chart.component';
import { NetworkChartComponent } from '../charts/network-chart/network-chart.component';
import { TimeAnalysisChartComponent } from '../charts/time-analysis-chart/time-analysis-chart.component'
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from "fusioncharts";
import * as charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { SharedModule } from './shared.module';


FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);
FusionCharts.options["license"]({
    key: "RjD2fA-21qC3E4A1A4F4H3C7C9B6B1D4F5poiB9D2A7iC4B4A3I-8J-7jA5C5B3tpgI2D1A4tllE2B4G1A2E2B6C5A3E6D4C4ckeC8D5PF4kmA-8D2G1B6ue1C2KC1C1I-8I-7oB1E6B1B3H3E2A14A19A6C5C6D3A1G4w==",
    creditLabel: false,
    })
@NgModule({
    declarations: [
        AreaChartComponent,
        HorizontalBarChartComponent,
        PieChartComponent,
        StacketHorizontalBarChartComponent,
        StackedAreaChartComponent,
        LineChartComponent,
        BubbleChartComponent,
        TimeAnalysisChartComponent,
        NetworkChartComponent
    ],
    imports: [
        CommonModule,
        NgxChartsModule,
        NgxGraphModule,
        FusionChartsModule,
        SharedModule

        
    ],
    exports: [ 
        AreaChartComponent, 
        HorizontalBarChartComponent, 
        PieChartComponent,
        StacketHorizontalBarChartComponent,
        StackedAreaChartComponent,
        LineChartComponent,
        TimeAnalysisChartComponent,
        BubbleChartComponent,
        NetworkChartComponent
    ]
  })

export class ChartsModule { }
