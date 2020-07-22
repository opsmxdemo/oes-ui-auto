import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions } from 'src/app/models/charts/chartOptionalParameter.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.less']
})
export class LineChartComponent implements OnInit {
  @Input() dataSource: any[];
  @Input() view: any[];
  @Input() chartProperty:ChartOptions;

  //options
  showLegend: boolean;
  animations: boolean;
  showXAxis: boolean;
  showYAxis: boolean;
  showYAxisLabel: boolean;
  showXAxisLabel: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  gradient: boolean;
  legendPosition: string;
  timeline: boolean;
  autoScale: boolean;
  colorScheme;

  constructor() {}

  ngOnInit(){
    debugger
    this.showLegend = this.chartProperty.showLegend !== undefined ? this.chartProperty.showLegend : true;
    this.animations = this.chartProperty.animations !== undefined ? this.chartProperty.animations : true;
    this.gradient = this.chartProperty.gradient !== undefined ? this.chartProperty.gradient : true;
    this.showXAxis = this.chartProperty.showXAxis !== undefined ? this.chartProperty.showXAxis : true;
    this.showYAxis = this.chartProperty.showYAxis !== undefined ? this.chartProperty.showYAxis : true;
    this.showXAxisLabel = this.chartProperty.showXAxisLabel !== undefined ? this.chartProperty.showXAxisLabel : true;
    this.showYAxisLabel = this.chartProperty.showYAxisLabel !== undefined ? this.chartProperty.showYAxisLabel : true;
    this.xAxisLabel = this.chartProperty.xAxisLabel !== undefined ? this.chartProperty.xAxisLabel : "";
    this.yAxisLabel = this.chartProperty.yAxisLabel !== undefined ? this.chartProperty.yAxisLabel : "";
    this.legendPosition = this.chartProperty.legendPosition !== undefined ? this.chartProperty.legendPosition : "below";
    this.autoScale = this.chartProperty.autoScale !== undefined ? this.chartProperty.autoScale : true;
    this.timeline = this.chartProperty.timeline !== undefined ? this.chartProperty.timeline : false;
    this.colorScheme = this.chartProperty.colorScheme !== undefined ? this.chartProperty.colorScheme : {domain: ['#33b3f1','#f29798','#fed856']};
  }

  
  onSelect(data): void {}

  onActivate(data): void {}

  onDeactivate(data): void {}

}
