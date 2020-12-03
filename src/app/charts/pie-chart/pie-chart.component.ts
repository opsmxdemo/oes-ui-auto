import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions } from 'src/app/models/charts/chartOptionalParameter.model';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.less']
})
export class PieChartComponent implements OnInit {

  @Input() dataSource: any[];
  @Input() view: any[];
  @Input() chartProperty:ChartOptions;

  // options
  gradient: boolean;
  showLegend: boolean;
  showLabels: boolean;
  isDoughnut: boolean;
  animations: boolean;
  legendPosition: string;
  colorScheme;

  onSelect(data): void {}

  onActivate(data): void {}

  onDeactivate(data): void {}

  constructor() { }

  ngOnInit(){
    this.showLegend = this.chartProperty.showLegend !== undefined ? this.chartProperty.showLegend : false;
    this.animations = this.chartProperty.animations !== undefined ? this.chartProperty.animations : true;
    this.gradient = this.chartProperty.gradient !== undefined ? this.chartProperty.gradient : true;
    this.isDoughnut = this.chartProperty.isDoughnut !== undefined ? this.chartProperty.isDoughnut : false;
    this.showLabels = this.chartProperty.showLabels !== undefined ? this.chartProperty.showLabels : true;
    this.legendPosition = this.chartProperty.legendPosition !== undefined ? this.chartProperty.legendPosition : "below";
    this.colorScheme = this.chartProperty.colorScheme !== undefined ? this.chartProperty.colorScheme : {domain: ['#b1d38b','#f29798',"#fed856"]};
  }

}
