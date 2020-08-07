import { Component, OnInit, Input ,OnChanges,SimpleChanges, HostListener, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import * as LogAnalysisAction from './store/log-analysis.actions';
import * as fromFeature from '../store/feature.reducer';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-log-analysis',
  templateUrl: './log-analysis.component.html',
  styleUrls: ['./log-analysis.component.less']
})
export class LogAnalysisComponent implements OnInit ,OnChanges ,AfterViewInit{
 
  @ViewChild('ChartSize') ChartSize: ElementRef;
  @ViewChild('expColBtn') expColBtn: ElementRef;

  @Input() canaryId: any[];
  @Input() serviceId: any[];

  showChart = true;                                                   // It is use to hide or show the bubble chart.
  switchToState = 'Collapse All';                                     // It is use to store value of Template State which user want to switch.
  logAnalysisResults :any;
  logAnalysisClusters :[] ;
  logAnalysisData : any;
  sensitivityLevels :any = ["high", "medium", "low"];
  logSensitivityScores:any= [{"high":{}}, {"low":{}}, {"medium":{}}];
  selectedSensitivity:string = "";
  bubbleChartData : any = [];
  criticalArray :any;
  errorArray : any;
  warningArray :any; 
  eventTab : any;
  eventTabLabeledBy: any; 
  chartSize: any[];                                                   // It is use to store graph width on change of layout widyh.
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
    "animations":true,
    "showGridLines": true,
    "colorScheme":{
      "domain":["#a70000","#f1727f","#ffc107","#c2c2c2"]
    }
  };
  criticalityList = [
    {	
      "criticalityColor":"dark red",
      "displayValue":"Critical Error",
      "textclass" : "text-danger"
    },
    {	
      "criticalityColor":"red",
      "displayValue":"Error",
      "textclass" : "text-error"
    },
    {	
      "criticalityColor":"yellow",
      "displayValue":"Warning",
      "textclass" : "text-warning"
    },
    {	
      "criticalityColor":"green",
      "displayValue":"Ignore",
      "textclass" : "text-muted"
    }
  ];
  clusterTagList = [
    {	
      "value":"BUILD ERROR",
      "displayValue":"Build Error",
      "textclass" : "text-danger"
    },
    {	
      "value":"INFRA ERROR",
      "displayValue":"Infra Error",
      "textclass" : "text-error"
    },
    {	
      "value":"BUILD WARNING",
      "displayValue":"Build Warning",
      "textclass" : "text-warning"
    },
    {	
      "value":"INFRA WARNING",
      "displayValue":"Infra Warning",
      "textclass" : "text-warning"
    },
    {	
      "value":"UNCLASSIFIED",
      "displayValue":"UnClassified",
      "textclass" : "text-muted"
    }
  ];
  classifiedLogsList = [];
  logTemplate = "";
  selectedClusterInfo : any;
  constructor(public store: Store<fromFeature.State>,
              public cdr: ChangeDetectorRef,
              private elRef:ElementRef) {}


  ngAfterViewInit(){
    //setting initial width of graph
    this.chartSize = [this.ChartSize.nativeElement.offsetWidth,300];
    this.cdr.detectChanges();
  }

  ngOnInit(): void {  
      this.getLogAnalysis();      
  }
 
  ngOnChanges(changes: SimpleChanges): void {    
    this.getLogAnalysis()
  }

  // below function is use to make page responsive
  @HostListener('window:click', ['$event.target'])
  handleClick(target){
    if(target.classList['value'] === 'fa fa-chevron-right' || target.classList['value'] === 'fa fa-chevron-left' || 
       target.classList['value'] === 'ng-star-inserted' || 
       target.classList[1] === 'fa-bars' || 
       target.textContent === 'Log Analysis' ||
       target.classList['value'] === 'toggleGraph'){
      if(this.showChart){
        this.chartSize = [0,300];
        setTimeout(() =>{
          this.chartSize = [this.ChartSize.nativeElement.offsetWidth,300]
        },500)
      }
    }
  }
   
  getLogAnalysis(){
    this.eventTab = 'unexpected';
    this.eventTabLabeledBy = 'unexpected-tab';      
    this.store.dispatch(LogAnalysisAction.loadLogResults({canaryId: this.canaryId, serviceId: this.serviceId }));    
    this.store.select(fromFeature.selectLogAnalysisState).subscribe(
    (resData) => {
      if(resData.logsResults !== null){          
          this.logAnalysisResults = resData.logsResults; 
          this.logAnalysisResults.sensitivity ? this.selectedSensitivity = this.logAnalysisResults.sensitivity : this.selectedSensitivity = "";
          this.logAnalysisResults.templateName ? this.logTemplate = this.logAnalysisResults.templateName.split(":").pop() : this.logTemplate = "";
          this.logAnalysisResults.data ? this.logAnalysisData = this.logAnalysisResults.data : this.logAnalysisData = [];          
          if(this.logAnalysisData.clusters){
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
          }else{
            this.bubbleChartData = [
              {
                "name": "Critical",
                "series":[]
              },
              {
                "name": "Error",
                "series":[]
              },
              {
                "name": "Warning",
                "series":[]
              }
            ];
          }

          if(this.logAnalysisResults.scores){
            this.logSensitivityScores = [];
            if(parseInt(this.logAnalysisResults.maximumCanaryScore) >= this.logAnalysisResults.scores.high){
              let obj = {"high":{ "score" : this.logAnalysisResults.scores.high, "risk" : "Low", "iconclass": " fa-arrow-down text-success", "textclass": "text-success"}};
              this.logSensitivityScores.push(obj);
            }else if(parseInt(this.logAnalysisResults.minimumCanaryScore) <= this.logAnalysisResults.scores.high){
              let obj = {"high":{ "score" : this.logAnalysisResults.scores.high, "risk" : "High", "iconclass":"fa-arrow-up text-danger", "textclass": "text-danger"}};
              this.logSensitivityScores.push(obj);            
            }else{
              let obj = {"high":{ "score" : this.logAnalysisResults.scores.high, "risk" : "Medium", "iconclass":"fa-arrow-up text-warning", "textclass": "text-warning"}};
              this.logSensitivityScores.push(obj);            
            }
            if(parseInt(this.logAnalysisResults.maximumCanaryScore) >= this.logAnalysisResults.scores.medium){
              let obj = {"medium":{ "score" : this.logAnalysisResults.scores.medium, "risk" : "Low", "iconclass": " fa-arrow-down text-success", "textclass": "text-success"}};
              this.logSensitivityScores.push(obj);
            }else if(parseInt(this.logAnalysisResults.minimumCanaryScore) <= this.logAnalysisResults.scores.medium){
              let obj = {"medium":{ "score" : this.logAnalysisResults.scores.medium, "risk" : "High", "iconclass":" text-danger", "textclass": "text-danger"}};
              this.logSensitivityScores.push(obj);            
            }else{
              let obj = {"medium":{ "score" : this.logAnalysisResults.scores.medium, "risk" : "Medium", "iconclass":"fa-arrow-up text-warning", "textclass": "text-warning"}};
              this.logSensitivityScores.push(obj);            
            }
            if(parseInt(this.logAnalysisResults.maximumCanaryScore) >= this.logAnalysisResults.scores.low){
              let obj = {"low":{ "score" : this.logAnalysisResults.scores.low, "risk" : "Low", "iconclass": " fa-arrow-down text-success", "textclass": "text-success"}};
              this.logSensitivityScores.push(obj);
            }else if(parseInt(this.logAnalysisResults.minimumCanaryScore) <= this.logAnalysisResults.scores.high){
              let obj = {"low":{ "score" : this.logAnalysisResults.scores.low, "risk" : "High", "iconclass":"fa-arrow-up text-danger", "textclass": "text-danger"}};
              this.logSensitivityScores.push(obj);            
            }else{
              let obj = {"low":{ "score" : this.logAnalysisResults.scores.low, "risk" : "Medium", "iconclass":"fa-arrow-up text-warning", "text-class": "text-warning"}};
              this.logSensitivityScores.push(obj);            
            }
          } 
          // below logic is use to expand the template initially.
          setTimeout(() => {
            this.expColBtn.nativeElement.click();
          })     
      }
    }
  );
   
  }

  changeSensitivity(e) {
    console.log(e.target.value);
    console.log(this.selectedSensitivity);
  }

  changeCriticality(e,log){    
    console.log(log);
    this.selectedClusterInfo = log;
    let changedTopic = "";
    //code to get topic which is selected on change of criticality drop down
    if(e.target.value == 'dark red'){
      changedTopic = 'CRITICAL ERROR';
    }else if(e.target.value == 'red'){
      changedTopic = 'ERROR';
    }else if(e.target.value == 'yellow'){
      changedTopic = 'WARN';
    }else if(e.target.value == 'green'){
      changedTopic = 'IGNORE';
    }
    var feedbackErrorTopicsList = {
      "type":"topic",
      "topic": changedTopic,
      "cluster": log.clusterTemplate,
      "logId": log.id,
      "feedbackComment": (log.comment == "" || log.comment == undefined) == true ? "" :log.comment ,
      "version": log.version,
      "existingTopic": log.topic,
      "ratio" : log.version == 'v1v2' ? log.v1Len/log.v2Len : ""
  }  
  var idValue = this.classifiedLogsList.findIndex(x => x.logId === feedbackErrorTopicsList.logId);
  if(idValue != -1){
    if(this.classifiedLogsList[idValue].type == "topic"){
      this.classifiedLogsList.splice(idValue,1);  
    }
  }
  this.classifiedLogsList.push(feedbackErrorTopicsList);
  console.log(this.classifiedLogsList);
  }

  saveCriticalityComments(){
    var idValue = this.classifiedLogsList.findIndex(x => x.logId === this.selectedClusterInfo.id && x.type === "topic");
    this.classifiedLogsList[idValue].feedbackComment = this.selectedClusterInfo.comment;
    
  };

  changeClusterTag(e,log){
    console.log(e.target.value);
    console.log(log);
  };

  onClickLogEventTab(eventTab){
      console.log(eventTab);
      this.eventTab = eventTab;
      this.eventTabLabeledBy = eventTab + '-tab';
      this.store.dispatch(LogAnalysisAction.loadEventLogResults({canaryId: this.canaryId, serviceId: this.serviceId , event: eventTab}));    
      this.store.select(fromFeature.selectLogAnalysisState).subscribe(
        (resData) => {
          if(resData.logsEventResults !== null){          
              this.logAnalysisData = resData.logsEventResults;         
          }
        }
      );
  }

  // Below function is use to show or hide the bubble chart
  toggleGraph(event){
    this.showChart = !this.showChart;
    if(this.showChart){
      event.currentTarget.childNodes[0].style.transform = 'rotate(0deg)';
    }else{
      event.currentTarget.childNodes[0].style.transform = 'rotate(-90deg)';
    }
  }

  // Below function is use to colapse and expand templates on click of collapse or expand link
  onChangeTemplateState(){
    if(this.switchToState==="Collapse All"){
      this.switchToState = "Expand All";
    }else{
      this.switchToState = "Collapse All";
    }
    setTimeout(() => {
      this.expColBtn.nativeElement.click();
      // below condtion is use to collapse all template.
      if(this.switchToState==="Expand All"){
        setTimeout(()=>{
          this.elRef.nativeElement.querySelector(this.expColBtn.nativeElement.dataset.target).classList.remove('show');
        },400)
      }
    })
  }

  // Below function is use to assign dynamic id
  assignId(idObj){
    if(this.switchToState==="Collapse All"){
      return 'log';
    }else{
      return 'log'+idObj;
    }
  }
    //Function to rerun logs after reclassification
    rerunLogs(){ 
      var postDataToRerun = {
        "feedbackErrorTopics": this.classifiedLogsList,
        "sensitivity": this.selectedSensitivity
      };     
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!Some of the ReClassified Events may be moved to other tab depending on your selection.Do you want to proceed with rerun?",        
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Rerun'
      }).then((result) => {
        if (result.value) {
          this.store.dispatch(LogAnalysisAction.rerunLogs({logTemplate:this.logTemplate, userName: "OpsMxUser", canaryId:this.canaryId,serviceId: this.serviceId,postData:postDataToRerun}));
        }
      })
      
    }

}
