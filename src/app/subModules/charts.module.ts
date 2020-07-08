import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { AreaChartComponent } from '../charts/area-chart/area-chart.component';
import { HorizontalBarChartComponent } from '../charts/horizontal-bar-chart/horizontal-bar-chart.component';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { StacketHorizontalBarChartComponent } from '../charts/stacket-horizontal-bar-chart/stacket-horizontal-bar-chart.component';


@NgModule({
    declarations: [
        AreaChartComponent,
        HorizontalBarChartComponent,
        PieChartComponent,
        StacketHorizontalBarChartComponent
    ],
    imports: [
        CommonModule,
        NgxChartsModule
    ],
    exports: [ 
        AreaChartComponent, 
        HorizontalBarChartComponent, 
        PieChartComponent,
        StacketHorizontalBarChartComponent
    ]
  })

export class ChartsModule { }
