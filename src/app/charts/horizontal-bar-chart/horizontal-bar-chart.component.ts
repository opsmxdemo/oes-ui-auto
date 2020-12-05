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
  timeExists: boolean;

  constructor() {}

  onSelect(data): void {}

  onActivate(data): void {}

  onDeactivate(data): void {}

  ngOnInit(){
    this.showLegend         = this.chartProperty.showLegend || false;
    this.animations         = this.chartProperty.animations || true;
    this.showXAxis          = this.chartProperty.showXAxis || true;
    this.showYAxis          = this.chartProperty.showYAxis || true;
    this.showYAxisLabel     = this.chartProperty.showYAxisLabel || true;
    this.showXAxisLabel     = this.chartProperty.showXAxisLabel || true;
    this.xAxisLabel         = this.chartProperty.xAxisLabel || "";
    this.yAxisLabel         = this.chartProperty.yAxisLabel || "";
    this.gradient           = false;
    this.maxYAxisTickLength = this.chartProperty.maxYAxisTickLength || 10;
    this.maxXAxisTickLength = this.chartProperty.maxXAxisTickLength || 8;
    this.colorScheme        = this.chartProperty.colorScheme || {domain: ['#b1d38b','#f29798']};
    this.timeExists = false;
  }

}