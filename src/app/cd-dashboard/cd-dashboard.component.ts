import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, ViewChildren, QueryList, OnDestroy, ViewEncapsulation } from '@angular/core';
import * as LayoutAction from '../layout/store/layout.actions';
import * as CdDashboardAction from './store/cd-dashboard.actions';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { pieChartData } from './pie-data';

@Component({
  selector: 'app-cd-dashboard',
  templateUrl: './cd-dashboard.component.html',
  styleUrls: ['./cd-dashboard.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class CdDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('areaGraph') areaGraph: ElementRef;
  @ViewChildren('subGraph') subGraph: QueryList<ElementRef>;

  sidebarVisible = '';                                     // It is used to set chart width on click of menu btn of sidemenu. 
  mainChartData = null;                                    // It is use to store area chart data fetched from api.
  mainChartSize;                                           // It is use to store width and height of area chart at show and hide of sidenav.
  widgetChartSize;                                         // It is use to store width and height of widget chart at show and hide of sidenav.
  widgetRawData = null;                                    // It is use to store raw data of widget chart, i.e,how many chart exist in sub section.
  widgetChartLoading = [];                                 // It is use to store boolean type value based on no. of chart exist in widget is in loading state or not. 
  changeEventSubscription = null;                          // It is use to unsubscribe the subscription on leave of component.
  widgetChartsData  = [];                                  // It is use to store all data of widget charts.
  pieChartdata = pieChartData;

  // Below variable is for widget chart
  stackedHorizontalBarChart = 'stacket-horizontal-bar-chart';
  pieChart = 'pie-chart';
  HorizontalBarChart = 'horizontal-bar-chart';
  

  constructor( public store: Store<fromApp.AppState>,
               public cdr: ChangeDetectorRef) { }


  ngOnInit() {
    //resetting sidebarVisible value in state
    this.store.dispatch(new LayoutAction.SideBarToggle(''));

    // Below logic is use to fetch data from Cd-dashboard state
    this.store.select('cdDashboard').subscribe(
      (dashboardData) => {
        if (dashboardData.healthChartData !== null) {
          this.mainChartData = dashboardData.healthChartData;
        }
        if (dashboardData.widgetRawData !== null) {
          this.widgetRawData = dashboardData.widgetRawData;
          this.widgetChartLoading = dashboardData.subChartLoading;
          this.widgetChartsData = dashboardData.subChartData;
          console.log("chartdata",this.widgetChartsData);
          console.log("chartloadingdata",this.widgetChartLoading);
          this.createInitialData();
          this.fetchedChartData(!dashboardData.subDataFetched);
        }
      }
    );

    
  }

  ngAfterViewInit() {
    this.store.select('layout').subscribe(
      (layoutData) => {
        this.sidebarVisible = layoutData.sidebarVisible;

        if (this.widgetRawData !== null) {
          this.setWidth(this.sidebarVisible);
          this.cdr.detectChanges();
        } else {
          this.changeEventSubscription = this.subGraph.changes.subscribe(() => {
            this.setWidth(this.sidebarVisible)
            // below method is use to Try using ChangeDetectorRef to tell angular that there are new changes to the data sets after been checked.
            this.cdr.detectChanges();
          })
        }
      }
    )
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

  // Below function is use to set width of graphs exist in dashboard
  setWidth(sidebarVisible) {
    if (sidebarVisible === 'false') {
      this.mainChartSize = [this.areaGraph.nativeElement.offsetWidth + 200, 260];
      this.widgetChartSize = [this.subGraph.first.nativeElement.offsetWidth + (200 / 3), 260]
    } else if (sidebarVisible === 'true') {
      this.mainChartSize = [this.areaGraph.nativeElement.offsetWidth - 200, 260];
      this.widgetChartSize = [this.subGraph.first.nativeElement.offsetWidth - (200 / 3), 260]
    } else {
      // Below we are setting initial width of graph
      this.mainChartSize = [this.areaGraph.nativeElement.offsetWidth, 260];
      this.widgetChartSize = [this.subGraph.first.nativeElement.offsetWidth, 260]
    }
  }




}
