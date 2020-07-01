import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { multi } from './data';
import {barGraphData} from './bar-data';
import {pieChartData} from './pie-data';

@Component({
  selector: 'app-oes-dashboard',
  templateUrl: './oes-dashboard.component.html',
  styleUrls: ['./oes-dashboard.component.less']
})
export class OesDashboardComponent implements OnInit {
  
  // option for application helath area chart
  multi: any[];
  view: any[] = [1100, 230];
  legend: boolean = false;
   showLabels: boolean = true;
  animations: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'Count';
  legendPosition: string = 'below';

  
  // options for active pipelines bar graph
  barGraphData: any[];
  viewBar: any[] = [360,232];
  showXAxisBar: boolean = true;
  showYAxisBar: boolean = true;
  gradient: boolean = false;
  showLegendBar: boolean = false;
  showXAxisLabelBar: boolean = true;
  showYAxisLabelBar: boolean = true;
  xAxisLabelBar: string = 'Count';

  // options for piechart automatedverification
  pieChartData: any[];
  viewPie: any[] = [360, 232];

  // options
  gradientPie: boolean = true;
  showLegendPie: boolean = true;
  showLabelsPie: boolean = true;
  isDoughnutPie: boolean = false;
  legendPositionPie: string = 'below';


  colorScheme = {
    domain: ['#66c285','#ffaeb6']
  };

  constructor(public notification: NotificationService) {
   }

  ngOnInit(){
    Object.assign(this, { multi });
    Object.assign(this, { barGraphData });
    Object.assign(this, {pieChartData});

  }
  onSelect(event) {
    console.log(event);
  }
  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
