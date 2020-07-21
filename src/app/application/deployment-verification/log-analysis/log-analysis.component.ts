import { Component, OnInit, Input } from '@angular/core';
import * as LogAnalysisAction from './store/log-analysis.actions';
import * as fromFeature from '../store/feature.reducer';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-log-analysis',
  templateUrl: './log-analysis.component.html',
  styleUrls: ['./log-analysis.component.less']
})
export class LogAnalysisComponent implements OnInit {
  @Input() canaryId: any[];
  @Input() serviceId: any[];

  constructor(public store: Store<fromFeature.State>) { }

  ngOnInit(): void {
  
      this.getLogAnalysis();
  }

  getDetails(){
    console.log(this.canaryId,this.serviceId);
  }
   getLogAnalysis(){
     console.log(this.canaryId, this.serviceId);
    this.store.dispatch(LogAnalysisAction.loadLogResults());
    this.store.select(fromFeature.selectLogAnalysisState).subscribe(
    (resData) => {
      if(resData.logsResults !== null){
             // this.deployementLoading = resData.deployementLoading;
             //this.logAnalysisResults = resData.logsResults; 
             // this.store.dispatch(LogAnalysisAction.loadLogResults({canaryId: this.deployementRun}));
           
         }
    }
  );
   
  }

}
