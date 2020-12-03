import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions } from 'src/app/models/charts/chartOptionalParameter.model';

@Component({
  selector: 'app-stacked-area-chart',
  templateUrl: './stacked-area-chart.component.html',
  styleUrls: ['./stacked-area-chart.component.less']
})
export class StackedAreaChartComponent implements OnInit {

  @Input() dataSource: any[];
  @Input() view: any[];
  @Input() chartProperty: ChartOptions;

  // options
  showLegend: boolean;
  animations: boolean;
  showXAxis: boolean;
  showYAxis: boolean;
  showYAxisLabel: boolean;
  showXAxisLabel: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  timeline: boolean;
  legendPosition: string;
  gradient: boolean;
  trimXAxisTicks: boolean;
  colorScheme;


  constructor() { }

  ngOnInit(): void {
    this.showLegend = this.chartProperty.showLegend !== undefined ? this.chartProperty.showLegend : true;
    this.animations = this.chartProperty.animations !== undefined ? this.chartProperty.animations : true;
    this.showXAxis = this.chartProperty.showXAxis !== undefined ? this.chartProperty.showXAxis : true;
    this.showYAxis = this.chartProperty.showYAxis !== undefined ? this.chartProperty.showYAxis : true;
    this.showYAxisLabel = this.chartProperty.showYAxisLabel !== undefined ? this.chartProperty.showYAxisLabel : true;
    this.showXAxisLabel = this.chartProperty.showXAxisLabel !== undefined ? this.chartProperty.showXAxisLabel : true;
    this.xAxisLabel = this.chartProperty.xAxisLabel !== undefined ? this.chartProperty.xAxisLabel : "";
    this.yAxisLabel = this.chartProperty.yAxisLabel !== undefined ? this.chartProperty.yAxisLabel : "";
    this.timeline = this.chartProperty.timeline !== undefined ? this.chartProperty.timeline : false;
    this.gradient = this.chartProperty.gradient !== undefined ? this.chartProperty.gradient : false;
    // this.autoScale = this.chartProperty.autoScale !== undefined ? this.chartProperty.autoScale : true;
    this.legendPosition = this.chartProperty.legendPosition !== undefined ? this.chartProperty.legendPosition : "below";
    this.colorScheme = this.chartProperty.colorScheme !== undefined ? this.chartProperty.colorScheme : { domain: ['#b1d38b', '#f29798', '#fed856', '#c2c2c2'] };
  }

  onSelect(event) {
  }

}
