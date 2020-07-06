import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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

  sidebarVisible = '';
  
  // below variable to use in area chart
  data = multi;
  areaGraphSize;

  subGraphSize;
  stackedBarGraphdata = barGraphData;
  pieChartdata = pieChartData;

  constructor(public store: Store<fromApp.AppState>) { }
  ngOnInit(){
    //resetting sidebarVisible value in state
    this.store.dispatch(new LayoutAction.SideBarToggle(''));
  }
  ngAfterViewInit(){
    this.store.select('layout').subscribe(
      (layoutData) => {
        this.setWidth(layoutData.sidebarVisible);
        this.sidebarVisible = layoutData.sidebarVisible;
      }
    )
  }
  
  // Below function is use to set width of graphs exist in dashboard
  setWidth(sidebarVisible){
    if(sidebarVisible === 'false'){
      this.areaGraphSize = [this.areaGraph.nativeElement.offsetWidth+200, 230];
      this.subGraphSize = [this.subGraph.nativeElement.offsetWidth+(200/3),230]
    }else if(sidebarVisible === 'true'){
      this.areaGraphSize = [this.areaGraph.nativeElement.offsetWidth-200, 230];
      this.subGraphSize = [this.subGraph.nativeElement.offsetWidth-(200/3),230]
    }else{
      // Below we are setting initial width of graph
      this.areaGraphSize = [this.areaGraph.nativeElement.offsetWidth, 230];
      this.subGraphSize = [this.subGraph.nativeElement.offsetWidth,230]
    }
  }

  
    

}
