import { Component, OnInit } from '@angular/core';
import * as LogAnalysisAction from './store/log-analysis.actions';
import * as fromApp from '../../../store/app.reducer';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-log-analysis',
  templateUrl: './log-analysis.component.html',
  styleUrls: ['./log-analysis.component.less']
})
export class LogAnalysisComponent implements OnInit {

  constructor(public store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
      this.getLogAnalysis();
  }

   
   getLogAnalysis(){
    this.store.dispatch(LogAnalysisAction.loadLogResults());
    this.store.select('logAnalysis').subscribe(
    (resData) => {
      debugger;
      if(resData.logsResults !== null){
             // this.deployementLoading = resData.deployementLoading;
             //this.logAnalysisResults = resData.logsResults; 
             // this.store.dispatch(LogAnalysisAction.loadLogResults({canaryId: this.deployementRun}));
           
         }
    }
  );
   
  }

}
