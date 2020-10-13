import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChartOptions } from 'src/app/models/charts/chartOptionalParameter.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.less']
})
export class LineChartComponent implements OnInit {
  @Output() getMetricId = new EventEmitter();
  @Input() dataSource: any[];
  @Input() view: any[];
  @Input() chartProperty:ChartOptions;
  @Input() Correlationflag:boolean = false;
  @Input() TrendAnalysisFlag: boolean = false;
  @Input() dataSourceCorreleation: any;
  @Input() serviceId: any;
  @Input() metricIndex: any;
  @Input() serviceName:any

  finalDataJson:any=[]
  //options
  showLegend: boolean;
  legendTitle: string;
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
  tooltipDisabled = false;
  ChartShow:any=true;

  constructor() {}

  ngOnInit() {
    this.showLegend = this.chartProperty.showLegend !== undefined ? this.chartProperty.showLegend : true;
    this.legendTitle = this.chartProperty.legendTitle !== undefined ? this.chartProperty.legendTitle : '';
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

    // for correlation related metric graph
    
    if(this.Correlationflag)
    {
    var obj = {
      name:this.serviceName+": "+this.dataSourceCorreleation.metricName,
      series:[]
  }
    this.finalDataJson.push(obj)
    for(let i=0;i<this.dataSourceCorreleation.data.length;i++)
    {
      let obj1={
        value:this.dataSourceCorreleation.data[i].y,
        name:new Date(this.dataSourceCorreleation.data[i].x)
      }
      this.finalDataJson[0].series.push(obj1)
    }
    this.dataSource = this.finalDataJson
  
  }
}
  closeTimeAnalysis() {
    this.getMetricId.emit({ "clusterId": this.metricIndex, "serviceId": this.serviceId });
    this.ChartShow=false;
  }
  
  onSelect(data): void {}

  onActivate(data): void {}

  onDeactivate(data): void {}

}
