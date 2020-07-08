import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.less']
})
export class AreaChartComponent implements OnInit {
  
  @Input() dataSource: any[];
  @Input() view: any[];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'Count';
  timeline: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#66c285','#e0d256','#ffaeb6','#c2c2c2']
  };

  constructor() {}

  ngOnInit(): void {
  }

  onSelect(event) {
    console.log(event);
  }

}
