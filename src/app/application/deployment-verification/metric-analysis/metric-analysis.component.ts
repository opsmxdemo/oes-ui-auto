import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { SharedService } from '../../../services/shared.service';
import * as MetricAnalysisActions from './store/metric-analysis.actions';


@Component({
  selector: 'app-metric-analysis',
  templateUrl: './metric-analysis.component.html',
  styleUrls: ['./metric-analysis.component.less']
})
export class MetricAnalysisComponent implements OnInit {

  @ViewChild('stickyMenu') menuElement: ElementRef;

  menuWidth: any;                                                     // It is use to store offsetTop of matric table.
  menuTop:number = 213;                                               // It define top of metric table.
  showGraph= false;
  size: string;
  showCommonInfo: string;
  sticky: boolean;                                                    // It is use to perform operation whether matric menu is sticky or not. 
  constructor(private sharedServices: SharedService,
              public store: Store<fromApp.AppState>) { }

  ngOnInit(){
    this.size= "col-md-12";
    this.store.dispatch(MetricAnalysisActions.loadMetricAnalysis());
  }

  // Below function is use to capture scroll event occur in matric analysis component.
  @HostListener('window:scroll', ['$event'])
    handleScroll(){
      this.menuWidth = this.menuElement.nativeElement.offsetWidth +'px';
        const windowScroll = window.pageYOffset;
        if(windowScroll >= this.menuTop){
            this.sticky = true;
        } else {
            this.sticky = false;
        }
    }


  getGraph(){
    this.showCommonInfo = 'hide';
  //  this.showGraph = true;
    this.size = "col-md-5";
  }

}
