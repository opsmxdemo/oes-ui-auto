import { Component, OnInit } from '@angular/core';
import * as LogAnalysisAction from './store/log-analysis.actions';
import * as fromFeature from '../store/feature.reducer';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-log-analysis',
  templateUrl: './log-analysis.component.html',
  styleUrls: ['./log-analysis.component.less']
})
export class LogAnalysisComponent implements OnInit {

  constructor(public store: Store<fromFeature.State>) { }

  ngOnInit(): void {
      this.getLogAnalysis();
  }

   
   getLogAnalysis(){
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
