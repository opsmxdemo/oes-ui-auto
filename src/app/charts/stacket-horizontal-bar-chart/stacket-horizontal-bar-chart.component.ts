import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions } from 'src/app/models/charts/chartOptionalParameter.model';

@Component({
  selector: 'app-stacket-horizontal-bar-chart',
  templateUrl: './stacket-horizontal-bar-chart.component.html',
  styleUrls: ['./stacket-horizontal-bar-chart.component.less']
})
export class StacketHorizontalBarChartComponent implements OnInit {

  @Input() dataSource: any[];
  @Input() view: any[];
  @Input() chartProperty:ChartOptions;
 
  // options
  showLegend: boolean;
  showYAxis:boolean;
  showXAxis:boolean;
  gradient: boolean;
  showXAxisLabel: boolean;
  yAxisLabel: string;
  showYAxisLabel: boolean;
  xAxisLabel: string;
  legendPosition: string;
  animations: boolean;
  colorScheme;
  

  constructor() {
    
  }

  ngOnInit(){
    this.showLegend = this.chartProperty.showLegend !== undefined ? this.chartProperty.showLegend : false;
    this.animations = this.chartProperty.animations !== undefined ? this.chartProperty.animations : true;
    this.gradient = this.chartProperty.gradient !== undefined ? this.chartProperty.gradient : false;
    this.showXAxis = this.chartProperty.showXAxis !== undefined ? this.chartProperty.showXAxis : true;
    this.showYAxis = this.chartProperty.showYAxis !== undefined ? this.chartProperty.showYAxis : true;
    this.showYAxisLabel = this.chartProperty.showYAxisLabel !== undefined ? this.chartProperty.showYAxisLabel : true;
    this.showXAxisLabel = this.chartProperty.showXAxisLabel !== undefined ? this.chartProperty.showXAxisLabel : true;
    this.xAxisLabel = this.chartProperty.xAxisLabel !== undefined ? this.chartProperty.xAxisLabel : "";
    this.yAxisLabel = this.chartProperty.yAxisLabel !== undefined ? this.chartProperty.yAxisLabel : "";
    this.legendPosition = this.chartProperty.legendPosition !== undefined ? this.chartProperty.legendPosition : "below";
    this.colorScheme = this.chartProperty.colorScheme !== undefined ? this.chartProperty.colorScheme : {domain: ['#b1d38b','#f29798',"#fed856"]};
  }

  onSelect(event) {}

}
