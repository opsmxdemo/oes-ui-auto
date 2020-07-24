import { Component, OnInit, Input ,OnChanges,SimpleChanges} from '@angular/core';
import * as LogAnalysisAction from './store/log-analysis.actions';
import * as fromFeature from '../store/feature.reducer';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-log-analysis',
  templateUrl: './log-analysis.component.html',
  styleUrls: ['./log-analysis.component.less']
})
export class LogAnalysisComponent implements OnInit ,OnChanges{
  @Input() canaryId: any[];
  @Input() serviceId: any[];

  logAnalysisResults :any;
  logAnalysisClusters :[] ;
  logAnalysisData : any;
  sensitivityLevels :any = ["HIGH", "MEDIUM", "LOW"];
  bubbleChartData : any = [];
  criticalArray :any;
  errorArray : any;
  warningArray :any;
  //bubbleChartProperty :any;
  view: any[] = [700, 200];
  bubbleChartProperty = {
    "showLegend":true,
    "showLabels": true,
    "xAxis": true,
    "yAxis": true,
    "showYAxisLabel": true,
    "showXAxisLabel": true,
    "xAxisLabel": "Log Events",
    "yAxisLabel":"Event Repeations",
    "tooltipDisabled": false,
    "showGridLines": true,
    "colorScheme":{
      "domain":["#a70000","#dc3545","#ffc107","#c2c2c2"]
    }
};
  constructor(public store: Store<fromFeature.State>) { }

  ngOnInit(): void {
  
      this.getLogAnalysis();
      
  }

 
  ngOnChanges(changes: SimpleChanges): void {
    console.log('value changed', this.canaryId, this.serviceId);
    this.getLogAnalysis()
  }

  getDetails(){
    console.log(this.canaryId,this.serviceId);
  }
  
  getLogAnalysis(){    
    this.store.dispatch(LogAnalysisAction.loadLogResults({canaryId: this.canaryId, serviceId: this.serviceId }));    
    this.store.select(fromFeature.selectLogAnalysisState).subscribe(
    (resData) => {
      if(resData.logsResults !== null){
          // this.deployementLoading = resData.deployementLoading;
          this.logAnalysisResults = resData.logsResults; 
          this.logAnalysisResults.data ? this.logAnalysisData = this.logAnalysisResults.data : [];          
          //this.logAnalysisData.clusters ? this.logAnalysisClusters = this.logAnalysisData.clusters : [];
          
          this.criticalArray = this.logAnalysisData.clusters.filter(function (el) {
            return el.color == 'dark red';
          });
          let criticalClusters = this.criticalArray.map(obj => {
            let rObj = {
              "name" : obj.id,
              "x" : obj.id,
              "y" :obj.v2Len + obj.v1Len,
              "r" : 5
            };
            return rObj
          })
          this.errorArray = this.logAnalysisData.clusters.filter(function (el) {
            return el.color == 'red';
          });
          let errorClusters = this.errorArray.map(obj => {
            let rObj = {
              "name" : obj.id,
              "x" : obj.id,
              "y" :obj.v2Len + obj.v1Len,
              "r" : 5
            };
            return rObj
          })
          this.warningArray = this.logAnalysisData.clusters.filter(function (el) {
            return el.color == 'yellow';
          });
          let warningClusters = this.warningArray.map(obj => {
            let rObj = {
              "name" : obj.id,
              "x" : obj.id,
              "y" :obj.v2Len + obj.v1Len,
              "r" : 5
            };
            return rObj
          })
        
          this.bubbleChartData = [
          {
            "name": "Critical",
            "series":criticalClusters
          },
          {
            "name": "Error",
            "series":errorClusters
          },
          {
            "name": "Warning",
            "series":warningClusters
          }
        ];
        
          // this.store.dispatch(LogAnalysisAction.loadLogResults({canaryId: this.deployementRun}));
        
         }
    }
  );
   
  }

  changeSensitivity(e) {
    console.log(e.target.value);
  }

}
