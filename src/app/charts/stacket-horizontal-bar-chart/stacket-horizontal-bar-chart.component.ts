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
  legend: boolean;
  xAxis:boolean;
  yAxis:boolean;
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
    this.legend = this.chartProperty.legend !== undefined || this.chartProperty.legend !== null ? this.chartProperty.legend : true;
    this.animations = this.chartProperty.animations !== undefined || this.chartProperty.animations !== null ? this.chartProperty.animations : true;
    this.xAxis = this.chartProperty.xAxis !== undefined || this.chartProperty.xAxis !== null ? this.chartProperty.xAxis : true;
    this.yAxis = this.chartProperty.yAxis !== undefined || this.chartProperty.yAxis !== null ? this.chartProperty.yAxis : true;
    this.showYAxisLabel = this.chartProperty.showYAxisLabel !== undefined || this.chartProperty.showYAxisLabel !== null ? this.chartProperty.showYAxisLabel : true;
    this.showXAxisLabel = this.chartProperty.showXAxisLabel !== undefined || this.chartProperty.showXAxisLabel !== null ? this.chartProperty.showXAxisLabel : true;
    this.xAxisLabel = this.chartProperty.xAxisLabel !== undefined || this.chartProperty.xAxisLabel !== "" ? this.chartProperty.xAxisLabel : "";
    this.yAxisLabel = this.chartProperty.yAxisLabel !== undefined || this.chartProperty.yAxisLabel !== "" ? this.chartProperty.yAxisLabel : "";
    this.legendPosition = this.chartProperty.legendPosition !== undefined || this.chartProperty.legendPosition !== "" ? this.chartProperty.legendPosition : "below";
    this.colorScheme = this.chartProperty.colorScheme !== undefined ? this.chartProperty.colorScheme : {domain: ['#33b3f1','#f29798',"#fed856"]};
  }

  onSelect(event) {
    console.log(event);
  }

}
