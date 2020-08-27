import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewChildren, QueryList, OnDestroy, ViewEncapsulation, HostListener, AfterViewInit } from '@angular/core';
import * as LayoutAction from '../layout/store/layout.actions';
import * as CdDashboardAction from './store/cd-dashboard.actions';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-cd-dashboard',
  templateUrl: './cd-dashboard.component.html',
  styleUrls: ['./cd-dashboard.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class CdDashboardComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('areaGraph') areaGraph: ElementRef;
  @ViewChildren('subGraph') subGraph: QueryList<ElementRef>;

  sidebarVisible = '';                                     // It is used to set chart width on click of menu btn of sidemenu. 
  mainChartData = null;                                    // It is use to store area chart data fetched from api.
  mainChartLoading;                                        // It is use to show or hide loading screen on mainchart section
  mainChartSize;                                           // It is use to store width and height of area chart at show and hide of sidenav.
  widgetChartSize;                                         // It is use to store width and height of widget chart at show and hide of sidenav.
  widgetRawData = null;                                    // It is use to store raw data of widget chart, i.e,how many chart exist in sub section.
  widgetChartLoading = [];                                 // It is use to store boolean type value based on no. of chart exist in widget is in loading state or not. 
  changeEventSubscription = null;                          // It is use to unsubscribe the subscription on leave of component.
  widgetChartsData  = [];                                  // It is use to store all data of widget charts.

  // Below variable is for widget chart
  stackedHorizontalBarChart = 'stacket-horizontal-bar-chart';
  pieChart = 'pie-chart';
  HorizontalBarChart = 'horizontal-bar-chart';
  

  constructor( public store: Store<fromApp.AppState>,
               public cdr: ChangeDetectorRef) { }


  ngAfterViewInit(){
    setTimeout(() =>{
      this.mainChartSize = [this.areaGraph.nativeElement.offsetWidth, 260];
      this.widgetChartSize = [this.subGraph.first.nativeElement.offsetWidth, 260]
    },500)
  }


  ngOnInit() {
    //resetting sidebarVisible value in state
    this.store.dispatch(new LayoutAction.SideBarToggle(''));

    // Below logic is use to fetch data from Cd-dashboard state
    this.store.select('cdDashboard').subscribe(
      (dashboardData) => {
        this.mainChartLoading = dashboardData.mainChartLoading;
        if (dashboardData.healthChartData !== null) {
          this.mainChartData = dashboardData.healthChartData;
        }
        if (dashboardData.widgetRawData !== null) {
          this.widgetRawData = dashboardData.widgetRawData;
          this.widgetChartLoading = dashboardData.subChartLoading;
          this.widgetChartsData = dashboardData.subChartData;
          this.createInitialData();
          this.fetchedChartData(!dashboardData.subDataFetched);
        }
      }
    );

    
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:click', ['$event'])
    handleClick(){
      if(this.areaGraph !== undefined && this.subGraph !== undefined){
        setTimeout(() =>{
          // Below we are setting initial width of graph
          this.mainChartSize = [this.areaGraph.nativeElement.offsetWidth, 260];
          this.widgetChartSize = [this.subGraph.first.nativeElement.offsetWidth, 260]
        },500)
      }
    }

  ngOnDestroy() {
    if (this.changeEventSubscription !== null) {
      this.changeEventSubscription.unsubscribe();
    }
  }

  // Below function is use to create initial array based on rawData fetched from api
  createInitialData(){
    if(this.widgetRawData !== null && this.widgetChartLoading === null){
      let chartLodingData = [];
      let chartData = [];
      this.widgetRawData.forEach(() => {
        chartLodingData.push(false);
        chartData.push({});
      })
      // Below dispatching actions to fetch data of subCharts present in rawData
      this.store.dispatch(CdDashboardAction.setInitialArrayData({initialSubChartLoading:chartLodingData,initialSubChartData:chartData}));
    }
  }

  // Below function is use to dispatch action to fetch subcharts data
  fetchedChartData(allowExecution){
    if(allowExecution && this.widgetChartLoading !== null){
      this.widgetRawData.forEach((subChart,index) => {
        this.store.dispatch(CdDashboardAction.loadSubChartData({subChartId:subChart.id,index}));
      })
    }
  }

  // Below function is use to reture true if subgraph data exist
  subGraphDataExist(data,returnSame){
    let returnVal:boolean;
    if(typeof data === 'object'){
      returnVal = false;
    }else{
      returnVal = true;
    }

    if(!returnSame){
      returnVal = !returnVal;
    }
    return returnVal;
  }

}
