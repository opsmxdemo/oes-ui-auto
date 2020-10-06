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

FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);
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
        FusionChartsModule
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
