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
  @ViewChild('LogClusterWidth') LogClusterWidth: ElementRef;
  @ViewChild('expColBtn') expColBtn: ElementRef;

  @Input() canaryId: any[];
  @Input() serviceId: any[];

  showChart = true;                                                   // It is use to hide or show the bubble chart.
  switchToState = 'Collapse All';                                     // It is use to store value of Template State which user want to switch.
  logAnalysisResults :any;
  dataSource: Object;
  clusterId:string;
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
  logClusterWidth = "0px";
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
  completeCluster : any;
  showFullLogLine:any = {};
  
  constructor(public store: Store<fromFeature.State>,
              public cdr: ChangeDetectorRef,
              private elRef:ElementRef) {
                this.dataSource = {
                  chart: {
                    "showValues": "0",
                    "showxaxisline":"1",
                    "showyaxisline":"1",
                    "legendPosition":"bottom-left",
                    "labelPadding":"0",
                    "xnumbersuffix": "",
                    "ynumberprefix": "",
                    "numDivlines": "0",
                    "numVDivLines": "0",
                    "showVZeroPlane": "0", //Vertical zero plane  	    	           
                    "theme": "fusion",
                     "bgColor": "#f4f8fb",
                    "canvasBgColor": "#f5f5f5",
                    "showcanvasborder": "0",
                    "showLegend": "1",
                    "valueFontAlpha":"0",
                    "showYAxisValues": "0",
                    "showXAxisValues": "0",
                    "canvasBottomPadding": "15",
                    "canvasLeftPadding": "15",
                    "canvasTopPadding": "15",
                    "canvasRightPadding": "15",
                    "canvasBorderThickness": "1",
                    "caption": "",
                    "subcaption": "",
                    "xAxisMinValue": "0",
                    "xAxisMaxValue": "",
                    "yAxisMinValue" : "0",
                    "showBorder":"0",
                    "yAxisMaxValue": "",
                    "minBubbleRadius":".5",
                    "xAxisName": "Log Events",
                    "yAxisName": "Event Repeations",
                    "bubbleScale":".20",
                    "showTrendlineLabels": "0",
                    "plotTooltext": "$zvalue",
                    "divlinealpha":"0",
                    "canvasBorderAlpha":"100",
                    
                    
                  },
                  categories: [
                    {
                      category: [
                        
                      ]
                    }
                  ],
                  dataset: [],
                 
                  
                };
              }


  ngAfterViewInit(){
    //setting initial width of graph
    this.chartSize = [this.ChartSize.nativeElement.offsetWidth,300];
    this.logClusterWidth = this.LogClusterWidth.nativeElement.offsetWidth + 35 + "px";
    this.cdr.detectChanges();
  }

  ngOnInit() {}
 
  ngOnChanges(changes: SimpleChanges): void { 
    if(this.canaryId !== undefined && this.serviceId !==undefined){
      this.getLogAnalysis()
    } 
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
          this.logClusterWidth = this.ChartSize.nativeElement.offsetWidth + 35 + "px" ;          
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
                  "x" : obj.id,
                  "y" :obj.v2Len + obj.v1Len,
                  "z" : obj.combineClust.substring(0, 500),
                  "name" : obj.id,
                };
                return rObj
              })
              this.errorArray = this.logAnalysisData.clusters.filter(function (el) {
                return el.color == 'red';
              });
              let errorClusters = this.errorArray.map(obj => {
                let rObj = {
                  "x" : obj.id,
                  "y" :obj.v2Len + obj.v1Len,
                  "z" : obj.combineClust.substring(0, 500),
                  "name" : obj.id,
                };
                return rObj
              })
              this.warningArray = this.logAnalysisData.clusters.filter(function (el) {
                return el.color == 'yellow';
              });
              let warningClusters = this.warningArray.map(obj => {
                let rObj = {
                  "x" : obj.id,
                  "y" :obj.v2Len + obj.v1Len,
                  "z" : obj.combineClust.substring(0, 500),
                  "name" : obj.id,
                };
                return rObj
              })      
              this.dataSource["dataset"]=[];
              let newobjcriticalClusters = {
                "color": "#a32133",
                "seriesName": "Critical",
                "data": criticalClusters
              };
              this.dataSource["dataset"].push(newobjcriticalClusters);

              let newobjerrorClusters = {
                  "color": "#e0392e",
                  "seriesName": "Errors",
                  "data": errorClusters
                };
              this.dataSource["dataset"].push(newobjerrorClusters);

              let newobjwarningClusters = {
                "color": "#f3af70",
                "seriesName": "Warning",
                "data": warningClusters
              };
            this.dataSource["dataset"].push(newobjwarningClusters);  
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
            if( this.expColBtn !==undefined){
              this.expColBtn.nativeElement.click();
            } 
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
            this.dataSource["dataset"]=[];
            if(this.eventTab=="expected")
            {
             
                let expectedcluster = resData.logsEventResults.clusters.map(obj => {
                  let rObj = {
                    "x" : obj.id,
                    "y" :obj.v2Len + obj.v1Len,
                    "z" : obj.combineClust.substring(0, 500),
                    "name" :obj.id ,
                  };
                  return rObj
                })
                let newobjexpectedClusters = {
                  "color": "#74ddc6",
                  "seriesName": "Expected",
                  "data": expectedcluster
                };
                this.dataSource["dataset"].push(newobjexpectedClusters);
            }
            if(this.eventTab=="baseline")
            {
             
                let baselinecluster = resData.logsEventResults.clusters.map(obj => {
                  let rObj = {
                    "x" : obj.id,
                    "y" :obj.v2Len + obj.v1Len,
                    "z" : obj.combineClust.substring(0, 500),
                    "name" :obj.id ,
                  };
                  return rObj
                })
                let newobjbaselineClusters = {
                  "color": "#343a40",
                  "seriesName": "Baseline",
                  "data": baselinecluster
                };
                this.dataSource["dataset"].push(newobjbaselineClusters);
            }
            if(this.eventTab=="ignored")
            {
             
                let ignoredcluster = resData.logsEventResults.clusters.map(obj => {
                  let rObj = {
                    "x" : obj.id,
                    "y" :obj.v2Len + obj.v1Len,
                    "z" : obj.combineClust.substring(0, 500),
                    "name" :obj.id ,
                  };
                  return rObj
                })
                let newobjignoredClusters = {
                  "color": "#6c757d",
                  "seriesName": "Ignored",
                  "data": ignoredcluster
                };
                this.dataSource["dataset"].push(newobjignoredClusters);
            }
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
      this.store.dispatch(LogAnalysisAction.rerunLogs({logTemplate:this.logTemplate,canaryId:this.canaryId,serviceId: this.serviceId,postData:postDataToRerun}));   
      // Swal.fire({
      //   title: 'Are you sure?',
      //   text: "You won't be able to revert this!Some of the ReClassified Events may be moved to other tab depending on your selection.Do you want to proceed with rerun?",        
      //   icon: 'warning',
      //   showCancelButton: true,
      //   confirmButtonColor: '#3085d6',
      //   cancelButtonColor: '#d33',
      //   confirmButtonText: 'Yes, Rerun'
      // }).then((result) => {
      //   if (result.value) {
      //     this.store.dispatch(LogAnalysisAction.rerunLogs({logTemplate:this.logTemplate, userName: "OpsMxUser", canaryId:this.canaryId,serviceId: this.serviceId,postData:postDataToRerun}));
      //   }
      // })
      
    }
    plotRollOver($event){
      this.clusterId = $event.dataObj.x

      document.getElementById(this.clusterId).scrollIntoView();
      
    }

    showMoreCluster(log){
      let clusterId = log.id;
      let version = log.version;
      this.store.dispatch(LogAnalysisAction.fetchClusterLogData({canaryId: this.canaryId, serviceId: this.serviceId , clusterId: clusterId, version: version}));    
      this.store.select(fromFeature.selectLogAnalysisState).subscribe(
        (resData) => {
          if(resData.clusterLogs !== null){          
              this.completeCluster = resData.clusterLogs; 
              Object.keys(this.showFullLogLine).forEach(h => {
                this.showFullLogLine[h] = false;
              });
              this.showFullLogLine[log.id] = true;        
          }
        }
      );
    }

    showLessCluster(log){      
      this.showFullLogLine[log.id] = false;
    }
}
