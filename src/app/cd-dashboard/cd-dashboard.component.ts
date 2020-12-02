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
export class CdDashboardComponent implements OnInit, OnDestroy, AfterViewInit {

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
  widgetChartsData = [];                                  // It is use to store all data of widget charts.

  // Below variable is for widget chart
  stackedHorizontalBarChart = 'stacket-horizontal-bar-chart';
  pieChart = 'pie-chart';
  HorizontalBarChart = 'horizontal-bar-chart';
  areaChart = 'area-chart';
  finalHealthChartData: any[];
  healthChartCounter: number;
  healthSeriesValue: any[];
  checkSeriesLength: boolean;
  chart4: any[];
  chart5: any[];
  selectedValue = '7D';
  chart3: any;


  constructor(public store: Store<fromApp.AppState>,
    public cdr: ChangeDetectorRef) { }


  ngAfterViewInit() {
    setTimeout(() => {
      this.mainChartSize = [this.areaGraph.nativeElement.offsetWidth, 260];
      if (this.subGraph.first && this.subGraph.first.nativeElement) {
        this.widgetChartSize = [this.subGraph.first.nativeElement.offsetWidth, 260]
      }

    }, 500)
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
          if (this.mainChartData != null) {
            this.finalHealthChartData = [];
            this.healthChartCounter = 0;
            this.mainChartData.DataSource.forEach((eachItem, index) => {
              this.healthSeriesValue = [];
              if (eachItem['series'].length > 0) {
                this.checkSeriesLength = true;
                eachItem['series'].forEach(eachValue => {
                  if (eachValue.name != undefined) {
                    this.healthSeriesValue.push({
                      "name": new Date(eachValue.name), "value": eachValue.value,
                    });
                  }
                });
                if (eachItem.name != undefined) {
                  this.finalHealthChartData[index] = {
                    "name": eachItem.name,
                    "series": this.healthSeriesValue

                  }
                }

                index++;
              } else {
                this.finalHealthChartData[index] = {
                  "name": eachItem.name,
                  "series": []

                }
              }
            })
          }
        }
        if (dashboardData.widgetRawData !== null) {
          this.widgetRawData = dashboardData.widgetRawData;
          this.widgetChartLoading = dashboardData.subChartLoading;
          this.widgetChartsData = dashboardData.subChartData;

          // if(this.widgetChartsData[3].DataSource.length > 0){
          //   debugger
          //   this.dateConversionData(this.widgetChartsData[3].DataSource,3)
          // }
          // this.dateConversionData(this.widgetChartsData);
          this.createInitialData();
          this.fetchedChartData(!dashboardData.subDataFetched);
        }
        if (dashboardData.subDataFetched) {
          this.dateConversionData(this.widgetChartsData);
        }
      }
    );


  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:click', ['$event'])
  handleClick() {
    if (this.areaGraph !== undefined && this.subGraph !== undefined) {
      setTimeout(() => {
        // Below we are setting initial width of graph
        this.mainChartSize = [this.areaGraph.nativeElement.offsetWidth, 260];
        if (this.subGraph.first && this.subGraph.first.nativeElement) {
          this.widgetChartSize = [this.subGraph.first.nativeElement.offsetWidth, 260]
        }

      }, 500)
    }
  }

  ngOnDestroy() {
    if (this.changeEventSubscription !== null) {
      this.changeEventSubscription.unsubscribe();
    }
  }

  // Below function is use to create initial array based on rawData fetched from api
  createInitialData() {
    if (this.widgetRawData !== null && this.widgetChartLoading === null) {
      let chartLodingData = [];
      let chartData = [];
      this.widgetRawData.forEach(() => {
        chartLodingData.push(false);
        chartData.push({});
      })
      // Below dispatching actions to fetch data of subCharts present in rawData
      this.store.dispatch(CdDashboardAction.setInitialArrayData({ initialSubChartLoading: chartLodingData, initialSubChartData: chartData }));
    }
  }

  // Below function is use to dispatch action to fetch subcharts data
  fetchedChartData(allowExecution, fromDate: any = '', toDate: any = '') {
    let date = new Date();
    if (!toDate) {
      toDate = date.getTime();
    }
    if (!fromDate) {
      fromDate = date.setDate(date.getDate() - 7);
      // fromDate = fromDate.getTime();
    }
    if (allowExecution && this.widgetChartLoading !== null) {
      this.widgetRawData.forEach((subChart, index) => {
        this.store.dispatch(CdDashboardAction.loadSubChartData({ subChartId: subChart.id, index, fromDate: fromDate, toDate: toDate }));
      })
    }
    if (allowExecution && this.widgetChartLoading !== null) {
      this.store.dispatch(CdDashboardAction.loadHealthChartData({ subChartId: 9, fromDate: fromDate, toDate: toDate }));
    }
  }

  // Below function is use to reture true if subgraph data exist
  subGraphDataExist(data, returnSame) {
    let returnVal: boolean;
    if (data.length > 0) {
      returnVal = true;
    } else {
      returnVal = false;
    }

    if (!returnSame) {
      returnVal = !returnVal;
    }
    return returnVal;
  }

  filterUpdated(event: any) {
    let filter = event.target.value;
    var date = new Date();
    let toDate = date.getTime(), fromDate;
    switch (filter) {
      case '1D':
        date.setDate(date.getDate() - 1);
        fromDate = date.getTime();
        break;
      case '7D':
        date.setDate(date.getDate() - 7);
        fromDate = date.getTime();
        break;
      case '1M':
        date.setMonth(date.getMonth() - 1);
        fromDate = date.getTime();
        break;
      case '6M':
        date.setMonth(date.getMonth() - 6);
        fromDate = date.getTime();
        break;
    }
    this.fetchedChartData(true, fromDate, toDate);
  }

  dateConversionData(data) {
    this.chart3 = [];
    this.chart4 = [];
    if (data[4].DataSource != undefined) {
      data[4].DataSource.forEach(element => {
        this.chart4.push({
          "name": element.name,
          "value": Math.round(Number(element.value) / (60000)),
        })
      });
    }

    if (data[3].DataSource != undefined) {
      data[3].DataSource.forEach(element => {
        this.chart3.push({
          "name": element.name,
          "value": Math.round(Number(element.value) / (60000)),
        })
      });
    }

  }

}
