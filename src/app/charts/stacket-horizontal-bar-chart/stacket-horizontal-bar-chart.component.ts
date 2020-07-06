import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stacket-horizontal-bar-chart',
  templateUrl: './stacket-horizontal-bar-chart.component.html',
  styleUrls: ['./stacket-horizontal-bar-chart.component.less']
})
export class StacketHorizontalBarChartComponent implements OnInit {

  @Input() dataSource: any[];
  @Input() view: any[];
 
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Population';
  legendPosition: string = 'below';
  animations: boolean = true;

  colorScheme = {
    domain: ['#66c285','#ffaeb6']
  };

  constructor() {
    
  }

  ngOnInit(): void {
  }

  onSelect(event) {
    console.log(event);
  }

}
