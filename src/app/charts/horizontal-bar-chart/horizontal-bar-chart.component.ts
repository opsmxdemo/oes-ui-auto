import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions } from 'src/app/models/charts/chartOptionalParameter.model';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.less']
})
export class HorizontalBarChartComponent implements OnInit {

  @Input() dataSource: any[];
  @Input() view: any[];
  @Input() chartProperty: ChartOptions;

  // options
  showXAxis: boolean;
  showYAxis: boolean;
  animations: boolean;
  gradient: boolean;
  showLegend: boolean;
  showXAxisLabel: boolean;
  yAxisLabel: string;
  showYAxisLabel: boolean;
  xAxisLabel: string;
  maxYAxisTickLength: number;
  maxXAxisTickLength: number;
  colorScheme;

  constructor() {}

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(){
    this.showLegend = this.chartProperty.showLegend !== undefined ? this.chartProperty.showLegend : false;
    this.animations = this.chartProperty.animations !== undefined ? this.chartProperty.animations : true;
    this.showXAxis = this.chartProperty.showXAxis !== undefined ? this.chartProperty.showXAxis : true;
    this.showYAxis = this.chartProperty.showYAxis !== undefined ? this.chartProperty.showYAxis : true;
    this.showYAxisLabel = this.chartProperty.showYAxisLabel !== undefined ? this.chartProperty.showYAxisLabel : true;
    this.showXAxisLabel = this.chartProperty.showXAxisLabel !== undefined ? this.chartProperty.showXAxisLabel : true;
    this.xAxisLabel = this.chartProperty.xAxisLabel !== undefined ? this.chartProperty.xAxisLabel : "";
    this.yAxisLabel = this.chartProperty.yAxisLabel !== undefined ? this.chartProperty.yAxisLabel : "";
    this.gradient = this.chartProperty.gradient !== undefined ? this.chartProperty.gradient : true;
    this.maxYAxisTickLength = this.chartProperty.maxYAxisTickLength !== undefined ? this.chartProperty.maxYAxisTickLength : 10;
    this.maxXAxisTickLength = this.chartProperty.maxXAxisTickLength !== undefined ? this.chartProperty.maxXAxisTickLength : 8;
    this.colorScheme = this.chartProperty.colorScheme !== undefined ? this.chartProperty.colorScheme : {domain: ['#33b3f1','#f29798']};
  }

}
