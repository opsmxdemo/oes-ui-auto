import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as LayoutAction from '../layout/store/layout.actions';
import * as fromApp from '../store/app.reducer';
import { multi } from './data';
import { barGraphData } from './bar-data';
import { Store } from '@ngrx/store';
import {pieChartData} from './pie-data';

@Component({
  selector: 'app-cd-dashboard',
  templateUrl: './cd-dashboard.component.html',
  styleUrls: ['./cd-dashboard.component.less']
})
export class CdDashboardComponent implements OnInit,AfterViewInit {

  @ViewChild('areaGraph') areaGraph: ElementRef;
  @ViewChild('subGraph') subGraph: ElementRef;

  sidebarVisible = '';                                     // It is used to set chart width on click of menu btn of sidemenu. 
  mainChartData;                                           // It is use to store area chart data fetched from api.
  mainChartSize;                                           // It is use to store width and height of area chart at show and hide of sidenav.
  widgetChartSize;                                         // It is use to store width and height of widget chart at show and hide of sidenav.
  widgetRawData;                                           // It is use to store raw data of widget chart, i.e,how many chart exist in sub section.
  widgetChartLoading = [];                                 // It is use to store boolean type value based on no. of chart exist in widget is in loading state or not. 
  stackedBarGraphdata = barGraphData;
  pieChartdata = pieChartData;

  constructor(public store: Store<fromApp.AppState>,
              public cdr: ChangeDetectorRef) { }
  ngOnInit(){
    //resetting sidebarVisible value in state
    this.store.dispatch(new LayoutAction.SideBarToggle(''));

    // Below logic is use to fetch data from Cd-dashboard state
    this.store.select('cdDashboard').subscribe(
      (dashboardData) => {
        if(dashboardData.healthChartData !== null){
          this.mainChartData = dashboardData.healthChartData;
          this.widgetRawData = dashboardData.widgetRawData;
          // Below method is use to call api of each charts exist in widget section.
          //this.callReleventSubChartApi();
        }
      }
    )
  }
  ngAfterViewInit(){
    this.store.select('layout').subscribe(
      (layoutData) => {
        this.setWidth(layoutData.sidebarVisible);
        this.sidebarVisible = layoutData.sidebarVisible;
        // below method is use to Try using ChangeDetectorRef to tell angular that there are new changes to the data sets after been checked.
        this.cdr.detectChanges();
      }
    )
  }
  
  // Below function is use to set width of graphs exist in dashboard
  setWidth(sidebarVisible){
    if(sidebarVisible === 'false'){
      this.mainChartSize = [this.areaGraph.nativeElement.offsetWidth+200, 230];
      this.widgetChartSize = [this.subGraph.nativeElement.offsetWidth+(200/3),230]
    }else if(sidebarVisible === 'true'){
      this.mainChartSize = [this.areaGraph.nativeElement.offsetWidth-200, 230];
      this.widgetChartSize = [this.subGraph.nativeElement.offsetWidth-(200/3),230]
    }else{
      // Below we are setting initial width of graph
      this.mainChartSize = [this.areaGraph.nativeElement.offsetWidth, 230];
      this.widgetChartSize = [this.subGraph.nativeElement.offsetWidth,230]
    }
  }

  
    

}
