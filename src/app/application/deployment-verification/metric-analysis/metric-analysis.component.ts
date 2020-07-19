import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFeature from '../store/feature.reducer';
import { SharedService } from '../../../services/shared.service';
import * as MetricAnalysisActions from './store/metric-analysis.actions';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-metric-analysis',
  templateUrl: './metric-analysis.component.html',
  styleUrls: ['./metric-analysis.component.less']
})
export class MetricAnalysisComponent implements OnInit {

  @ViewChild('stickyMenu') menuElement: ElementRef;

  menuWidth: any;                                                     // It is use to store offsetTop of matric table.
  menuTop:number = 213;                                               // It define top of metric table.
  metricData$:Observable<any>;
  sticky: boolean = false;                                            // It is use to perform operation whether matric menu is sticky or not. 
  constructor(private sharedServices: SharedService,
              public store: Store<fromFeature.State>) { }
  
  ngOnInit(){
    debugger
    this.store.dispatch(MetricAnalysisActions.loadMetricAnalysis());
    
    //fetching data from deployment verification state
    this.store.select(fromFeature.selectMetricAnalysisState).subscribe(
      (resdata)=>{
        console.log('rps',resdata);
      }
    )
    
    
  }

  // Below function is use to capture events occur in matric analysis component and make responsive to table.
 
  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:click', ['$event'])
  @HostListener('window:scroll', ['$event'])
    handleScroll(){
      setTimeout(() =>{
        this.menuWidth = this.menuElement.nativeElement.offsetWidth +'px';
      },500)
        const windowScroll = window.pageYOffset;
        if(windowScroll >= this.menuTop){
            this.sticky = true;
        } else {
            this.sticky = false;
        }
    }
}
