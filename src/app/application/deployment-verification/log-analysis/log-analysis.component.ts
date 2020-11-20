// import { clusters } from './../../application-dashboard/data';
import { Component, Input,Output, OnChanges, SimpleChanges, HostListener, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef,EventEmitter } from '@angular/core';
import * as LogAnalysisAction from './store/log-analysis.actions';
import * as fromFeature from '../store/feature.reducer';
import { Store } from '@ngrx/store';
import * as logTopicsList from '../../../../assets/data/logsTopicsList.json';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';



@Component({
  selector: 'app-log-analysis',
  templateUrl: './log-analysis.component.html',
  styleUrls: ['./log-analysis.component.less']
})
export class LogAnalysisComponent implements OnChanges, AfterViewInit {

  @ViewChild('ChartSize') ChartSize: ElementRef;
  @ViewChild('LogClusterWidth') LogClusterWidth: ElementRef;
  @ViewChild('expColBtn') expColBtn: ElementRef;

  @Input() canaryId: any[];
  @Input() serviceId: any[];
  @Input() isRerun : boolean;
  @Input() serviceStatus : any[];
  @Input() applicationId :any;
  @Output() selectedServiceIdFromChild = new EventEmitter<any>();
  @Output() enterdToLogLines = new EventEmitter<boolean>();

  showChart = true;                                                   // It is use to hide or show the bubble chart.
  switchToState = 'Collapse All';                                     // It is use to store value of Template State which user want to switch.
  logAnalysisResults: any;
  dataSource: Object;
  dataSourceColumnChart: Object;
  chart: any;
  isShow: any;
  logTopicsList1:any = logTopicsList;                                  // it is used to store data of logTopicsList.json
  ignoreTopicStrings = [];                                            // it is used to store all the strings of logTopicsList with topic ignore
  errorTopicStrings = [];                                            // it is used to store all the strings of logTopicsList with topic error
  warningTopicStrings = [];                                            // it is used to store all the strings of logTopicsList with topic warning
  criticalTopicStrings = [];                                            // it is used to store all the strings of logTopicsList with topic critical
  reclassificationHistory:any;
  comments:any;
  previousClickedId: any;
  timeStampResponse: any;
  slectedTimeAnalysis: any;
  clusterId: string;
  logAnalysisClusters: [];
  logAnalysisData: any;
  fetchLogTopics: any;
  sensitivityLevels: any = ["high", "medium", "low"];
  logSensitivityScores: any = [{ "high": {} }, { "low": {} }, { "medium": {} }];
  selectedSensitivity: string = "";
  bubbleChartData: any = [];
  criticalArray: any;
  errorArray: any;
  warningArray: any;
  eventTab: any;
  eventTabLabeledBy: any;
  logClusterWidth = "0px";
  chartSize: string;                                                   // It is use to store graph width on change of layout widyh.
  clusterCommentsList = [] ;                                   // it is used to send cluster data
  clusterComments: string;
  graphShrink:boolean = false
  bubbleChartProperty = {
    "showLegend": true,
    "showLabels": true,
    "xAxis": true,
    "yAxis": true,
    "showYAxisLabel": true,
    "showXAxisLabel": true,
    "xAxisLabel": "Log Events",
    "yAxisLabel": "Event Repeations",
    "tooltipDisabled": false,
    "animations": true,
    "showGridLines": true,
    "colorScheme": {
      "domain": ["#a70000", "#f1727f", "#ffc107", "#c2c2c2"]
    }
  };
  criticalityList = [
    {
      "criticalityColor": "dark red",
      "displayValue": "Critical Error",
      "textclass": "text-danger"
    },
    {
      "criticalityColor": "red",
      "displayValue": "Error",
      "textclass": "text-error"
    },
    {
      "criticalityColor": "yellow",
      "displayValue": "Warning",
      "textclass": "text-warning"
    },
    {
      "criticalityColor": "green",
      "displayValue": "Ignore",
      "textclass": "text-muted"
    }
  ];
  clusterTagList = [];
  clusterTagList1 = []
  classifiedLogsList = [];
  logTemplate = "";
  selectedClusterInfo: any;
  completeCluster: any;
  showFullLogLine: any = {};
  rerunResponse : any;
  errorMessage = 'No data found to display';                           // It is use when expected data not found in component.
  islogAnalysisAvailable = true;
  commentNotificationMessage = "";
  sensitivityChanged = false;
  tagCommentNotificationMessage = "";
  logId :any = undefined;
  selectedTags=[];
  

  constructor(public store: Store<fromFeature.State>,
    public cdr: ChangeDetectorRef,
    private elRef: ElementRef,
    private sanitizer: DomSanitizer) {
      for(var i=0;i<this.logTopicsList1.default.length;i++)
      {
        if(this.logTopicsList1.default[i].topic=="ERROR")
        {
          this.errorTopicStrings.push(this.logTopicsList1.default[i].string.toLowerCase())
          this.errorTopicStrings.push(this.logTopicsList1.default[i].string.toUpperCase())
        }
        else if(this.logTopicsList1.default[i].topic=="WARN")
        {
          this.warningTopicStrings.push(this.logTopicsList1.default[i].string.toLowerCase())
          this.warningTopicStrings.push(this.logTopicsList1.default[i].string.toUpperCase())
        }
        else if(this.logTopicsList1.default[i].topic=="IGNORE")
        {
          this.ignoreTopicStrings.push(this.logTopicsList1.default[i].string.toLowerCase())
          this.ignoreTopicStrings.push(this.logTopicsList1.default[i].string.toUpperCase())
        }
        else if(this.logTopicsList1.default[i].topic=="CRITICAL")
        {
          this.criticalTopicStrings.push(this.logTopicsList1.default[i].string.toLowerCase())
          this.criticalTopicStrings.push(this.logTopicsList1.default[i].string.toUpperCase())
        }
      }
      this.errorTopicStrings=this.sortByLength(this.errorTopicStrings)
      this.warningTopicStrings=this.sortByLength(this.warningTopicStrings)
      this.ignoreTopicStrings=this.sortByLength(this.ignoreTopicStrings)
      this.criticalTopicStrings=this.sortByLength(this.criticalTopicStrings)
      


  }


  ngAfterViewInit() {
    //setting initial width of graph
    setTimeout(() => {
      if (this.showChart) {
        if(this.ChartSize != undefined){
          this.chartSize = this.ChartSize.nativeElement.offsetWidth;
        }        
      }
      if (this.LogClusterWidth !=undefined) {
        this.logClusterWidth = this.LogClusterWidth.nativeElement.offsetWidth + "px";
      }
      this.cdr.detectChanges();
    }, 1000)
  }

  ngOnChanges(changes: SimpleChanges): void {
    // reseting variables on tab switch
    this.switchToState = 'Collapse All';
    this.dataSource = {
      chart: {
        "showValues": "0",
        "showxaxisline": "1",
        "showyaxisline": "1",
        "legendPosition": "bottom-left",
        "labelPadding": "0",
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
        "valueFontAlpha": "0",
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
        "yAxisMinValue": "0",
        "showBorder": "0",
        "yAxisMaxValue": "",
        "minBubbleRadius": ".5",
        "xAxisName": "Log Events",
        "yAxisName": "Event Repeations",
        "bubbleScale": ".20",
        "showTrendlineLabels": "0",
        "plotTooltext": "$zvalue",
        "divlinealpha": "0",
        "canvasBorderAlpha": "100",
      },
      categories: [
        {
          category: [

          ]
        }
      ],
      dataset: [],
    };
    this.dataSourceColumnChart = {
      chart: {
        caption: "",
        subcaption: "",
        "numDivlines": "2",
        xaxisname: "Time",
        yaxisname: "Repetition",
        theme: "fusion"
      },
      data: []
    };    
    if (this.canaryId != undefined && this.serviceId != undefined) {
      this.getLogAnalysis()
    }
    this.enterdToLogLines.emit(false);
    setTimeout(() => {
      if (this.showChart) {
        if(this.ChartSize != undefined){
          this.chartSize = this.ChartSize.nativeElement.offsetWidth;
        }        
      }
      if (this.LogClusterWidth !=undefined) {
        this.logClusterWidth = this.LogClusterWidth.nativeElement.offsetWidth + "px";
      }
      this.cdr.detectChanges();
    }, 1000)
  }
  
  
  ngOnInit(){
    this.store.select(fromFeature.selectLogAnalysisState).subscribe(
      (resData) => {
        if (resData.logsResults != null && resData.isLogsResultsLoaded){
          this.store.dispatch(LogAnalysisAction.loadedLogResults()); 
          this.store.dispatch(LogAnalysisAction.loadLogTopics());
          this.store.dispatch(LogAnalysisAction.loadCustomTags({ applicationId: this.applicationId }));
          this.logAnalysisResults = resData.logsResults;
          if (this.logAnalysisResults != null) {      
            this.logAnalysisResults.sensitivity ? this.selectedSensitivity = this.logAnalysisResults.sensitivity : this.selectedSensitivity = "";
            this.logAnalysisResults.templateName ? this.logTemplate = this.logAnalysisResults.templateName.split(":").pop() : this.logTemplate = "";
            this.logAnalysisResults.data ? this.logAnalysisData = this.logAnalysisResults.data : this.logAnalysisData = [];
            if (this.logAnalysisData.clusters) {
              if(this.logAnalysisData.clusters.length > 0){
                this.islogAnalysisAvailable = true;
                
                for(var i=0;i<this.logAnalysisData.clusters.length;i++)
                {
                  if(this.logAnalysisData.clusters[i].clusterTagInfo != null){
                  if(this.logAnalysisData.clusters[i].clusterTagInfo.tag==null)
                  {
                    this.selectedTags[this.logAnalysisData.clusters[i].id]="UNCLASSIFIED"
                  }
                  else{
                    this.selectedTags[this.logAnalysisData.clusters[i].id]=this.logAnalysisData.clusters[i].clusterTagInfo.tag
                  }
                }


                }
               
                this.criticalArray = this.logAnalysisData.clusters.filter(function (el) {
                  return el.color == 'dark red';
                });
                let criticalClusters = this.criticalArray.map(obj => {
                  let rObj = {
                    "x": obj.id,
                    "y": obj.v2Len + obj.v1Len,
                    "z": obj.combineClust.substring(0, 500),
                    "name": obj.id,
                  };
                  return rObj
                })
                this.errorArray = this.logAnalysisData.clusters.filter(function (el) {
                  return el.color == 'red';
                });
                let errorClusters = this.errorArray.map(obj => {
                  let rObj = {
                    "x": obj.id,
                    "y": obj.v2Len + obj.v1Len,
                    "z": obj.combineClust.substring(0, 500),
                    "name": obj.id,
                  };
                  return rObj
                })
                this.warningArray = this.logAnalysisData.clusters.filter(function (el) {
                  return el.color == 'yellow';
                });
                let warningClusters = this.warningArray.map(obj => {
                  let rObj = {
                    "x": obj.id,
                    "y": obj.v2Len + obj.v1Len,
                    "z": obj.combineClust.substring(0, 500),
                    "name": obj.id,
                  };
                  return rObj
                })
                this.dataSource["dataset"] = [];
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
                    "series": criticalClusters
                  },
                  {
                    "name": "Error",
                    "series": errorClusters
                  },
                  {
                    "name": "Warning",
                    "series": warningClusters
                  }
                ];
              }
            } else {
              this.bubbleChartData = [
                {
                  "name": "Critical",
                  "series": []
                },
                {
                  "name": "Error",
                  "series": []
                },
                {
                  "name": "Warning",
                  "series": []
                }
              ];
              this.islogAnalysisAvailable = false;
            }
            
      
            if (this.logAnalysisResults.scores) {
              this.logSensitivityScores = [];
              if (parseInt(this.logAnalysisResults.maximumCanaryScore) <= this.logAnalysisResults.scores.high) {
                let obj = { "high": { "score": this.logAnalysisResults.scores.high, "risk": "Low", "iconclass": " fa-arrow-down text-success", "textclass": "text-success" } };
                this.logSensitivityScores.push(obj);
              } else if (parseInt(this.logAnalysisResults.minimumCanaryScore) >= this.logAnalysisResults.scores.high) {
                let obj = { "high": { "score": this.logAnalysisResults.scores.high, "risk": "High", "iconclass": "fa-arrow-up text-danger", "textclass": "text-danger" } };
                this.logSensitivityScores.push(obj);
              } else {
                let obj = { "high": { "score": this.logAnalysisResults.scores.high, "risk": "Medium", "iconclass": "fa-arrow-up text-warning", "textclass": "text-warning" } };
                this.logSensitivityScores.push(obj);
              }
              if (parseInt(this.logAnalysisResults.maximumCanaryScore) <= this.logAnalysisResults.scores.medium) {
                let obj = { "medium": { "score": this.logAnalysisResults.scores.medium, "risk": "Low", "iconclass": " fa-arrow-down text-success", "textclass": "text-success" } };
                this.logSensitivityScores.push(obj);
              } else if (parseInt(this.logAnalysisResults.minimumCanaryScore) >= this.logAnalysisResults.scores.medium) {
                let obj = { "medium": { "score": this.logAnalysisResults.scores.medium, "risk": "High", "iconclass": " fa-arrow-up text-danger", "textclass": "text-danger" } };
                this.logSensitivityScores.push(obj);
              } else {
                let obj = { "medium": { "score": this.logAnalysisResults.scores.medium, "risk": "Medium", "iconclass": "fa-arrow-up text-warning", "textclass": "text-warning" } };
                this.logSensitivityScores.push(obj);
              }
              if (parseInt(this.logAnalysisResults.maximumCanaryScore) <= this.logAnalysisResults.scores.low) {
                let obj = { "low": { "score": this.logAnalysisResults.scores.low, "risk": "Low", "iconclass": " fa-arrow-down text-success", "textclass": "text-success" } };
                this.logSensitivityScores.push(obj);
              } else if (parseInt(this.logAnalysisResults.minimumCanaryScore) >= this.logAnalysisResults.scores.low) {
                let obj = { "low": { "score": this.logAnalysisResults.scores.low, "risk": "High", "iconclass": "fa-arrow-up text-danger", "textclass": "text-danger" } };
                this.logSensitivityScores.push(obj);
              } else {
                let obj = { "low": { "score": this.logAnalysisResults.scores.low, "risk": "Medium", "iconclass": "fa-arrow-up text-warning", "text-class": "text-warning" } };
                this.logSensitivityScores.push(obj);
              }
            }
      
            // below logic is use to expand the template initially.
            // setTimeout(() => {
            //   if (this.expColBtn != undefined) {
            //     if(this.expColBtn != undefined){
            //       this.expColBtn.nativeElement.click();
            //     }               
            //   }
            // })
      
          }else{
            this.islogAnalysisAvailable = false;
          }
        }
        if(resData.tags !=null && resData.isloadedCustomTags && this.clusterTagList.length==0)
        {
          
          this.clusterTagList1 = resData.tags
          for(let i =0;i<this.clusterTagList1.length;i++){
            this.clusterTagList.push(this.clusterTagList1[i])
          }
          var myobj = {
            "id":"",
            "name":"UNCLASSIFIED"
          }
          this.clusterTagList.push(myobj)
        }
        
        if(resData.logTopicsList != null){
          this.fetchLogTopics = resData.fetchLogTopics;        	
          this.fetchLogTopics = resData.logTopicsList;
          

              // fetching comments for each logs
              if(this.logAnalysisClusters!=null)
              {
                this.logAnalysisData.clusters.forEach((item) => {
                  this.clusterCommentsList.push(item.clusterTagInfo.comments);
                });
              }

        }	        
        if (resData.logsEventResults != null && resData.isLogsEventsLoaded ) {
          this.store.dispatch(LogAnalysisAction.loadedEventsLogs());
          this.logAnalysisData = resData.logsEventResults;
          this.dataSource["dataset"] = [];
          if (this.eventTab == "expected") {

            let expectedcluster = resData.logsEventResults.clusters.map(obj => {
              let rObj = {
                "x": obj.id,
                "y": obj.v2Len + obj.v1Len,
                "z": obj.combineClust.substring(0, 500),
                "name": obj.id,
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
          if (this.eventTab == "baseline") {

            let baselinecluster = resData.logsEventResults.clusters.map(obj => {
              let rObj = {
                "x": obj.id,
                "y": obj.v2Len + obj.v1Len,
                "z": obj.combineClust.substring(0, 500),
                "name": obj.id,
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
          if (this.eventTab == "ignored") {

            let ignoredcluster = resData.logsEventResults.clusters.map(obj => {
              let rObj = {
                "x": obj.id,
                "y": obj.v2Len + obj.v1Len,
                "z": obj.combineClust.substring(0, 500),
                "name": obj.id,
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
        if(resData.rerunResponse != null && resData.isLoadedRerunResults){
          this.store.dispatch(LogAnalysisAction.loadedRerunResults());
          if(resData.rerunResponse['status']){
            this.selectedServiceIdFromChild.emit(this.serviceId);
            this.classifiedLogsList = [];
            this.sensitivityChanged = false;
          }
        }
        if (resData.clusterLogs != null && resData.isLoadedClusterLogData) {
          this.store.dispatch(LogAnalysisAction.loadedClusterLogData());
          this.completeCluster = resData.clusterLogs;
          Object.keys(this.showFullLogLine).forEach(h => {
            this.showFullLogLine[h] = false;
          });
          this.showFullLogLine[this.logId] = true;
        }
      }
      
    );
  }
  
  // target.classList['value'].includes('criticality-select')
  // below function is use to make page responsive
  @HostListener('window:click', ['$event.target'])
  handleClick(target) {
    
    if (target.classList['value'] === 'fa fa-chevron-right' || target.classList['value'] === 'fa fa-chevron-left' ||
      target.classList['value'] === 'ng-star-inserted' ||
      target.classList[1] === 'fa-bars' ||
      target.textContent === 'Log Analysis' ) {

      if(target.classList[1] === 'fa-bars')
        {
          if (this.showChart) {
            this.graphShrink=true
            $(".fadeIN").fadeOut(300)
            this.chartSize = "1px";
            
            setTimeout(() => {
              if(this.ChartSize != undefined){
                this.chartSize =this.ChartSize.nativeElement.offsetWidth;
                this.graphShrink=false;
                $(".fadeIN").fadeIn(300)
              }
            }, 500)
          }
          if (this.LogClusterWidth) {
            this.logClusterWidth = "1px"
            setTimeout(() => {
              if(this.LogClusterWidth != undefined){
                this.logClusterWidth = this.LogClusterWidth.nativeElement.offsetWidth + "px";
                this.graphShrink=false;
                $(".fadeIN").fadeIn(300)
              }          
            }, 500)
          }
        }
        else{
          if (this.showChart) {
            this.graphShrink=true
            $(".fadeIN").fadeOut(300)
            this.chartSize = "1px";
            
            setTimeout(() => {
              if(this.ChartSize != undefined){
                this.chartSize =this.ChartSize.nativeElement.offsetWidth;
                this.graphShrink=false;
                $(".fadeIN").fadeIn(300)
              }
            }, 300)
          }
          if (this.LogClusterWidth) {
            this.logClusterWidth = "1px"
            setTimeout(() => {
              if(this.LogClusterWidth != undefined){
                this.logClusterWidth = this.LogClusterWidth.nativeElement.offsetWidth + "px";
                this.graphShrink=false;
                $(".fadeIN").fadeIn(300)
              }          
            }, 300)
          }
        }
      
    }
  }
  // below function is use to make page responsive list-unstyled m-0
  // @HostListener('window:mousemove', ['$event.target'])
  // handleMouseMove(target) {
  //   if(target.offsetParent != undefined){
  //     if (target.offsetParent.className === 'sidebar_nav' || target.id === 'logeventsTab') {
  //       if(target.id === 'logeventsTab'){
  //         this.enterdToLogLines.emit(true);
  //       }        
  //       if (this.showChart) {
  //         this.chartSize = "1px";
  //         setTimeout(() => {
  //           if(this.ChartSize != undefined){
  //             this.chartSize = this.ChartSize.nativeElement.offsetWidth
  //           }            
  //         }, 500)
  //       }
  //       if (this.LogClusterWidth) {
  //         this.logClusterWidth = "1px"
  //         setTimeout(() => {
  //           if(this.LogClusterWidth != undefined){
  //             this.logClusterWidth = this.LogClusterWidth.nativeElement.offsetWidth + "px";
  //           }            
  //         }, 500)
  //       }
  //     }
  //   }   
  // }

  getLogAnalysis() {
    this.clusterId = null;
    this.eventTab = 'unexpected';
    this.eventTabLabeledBy = 'unexpected-tab';
    this.clusterCommentsList = [];
    this.store.dispatch(LogAnalysisAction.loadLogResults({ canaryId: this.canaryId, serviceId: this.serviceId }));    
  }

  changeSensitivity(e) {
    this.sensitivityChanged = true;
  }

  changeCriticality(e, log) {
    this.commentNotificationMessage = "Reclassification comments";
    setTimeout(function () {
      this.commentNotificationMessage = "";
    }.bind(this), 5000);
    this.selectedClusterInfo = log;
    let changedTopic = "";
    //code to get topic which is selected on change of criticality drop down
    if (e.target.value == 'dark red') {
      changedTopic = 'CRITICAL ERROR';
    } else if (e.target.value == 'red') {
      changedTopic = 'ERROR';
    } else if (e.target.value == 'yellow') {
      changedTopic = 'WARN';
    } else if (e.target.value == 'green') {
      changedTopic = 'IGNORE';
    }
    var feedbackErrorTopicsList: any = {};
    feedbackErrorTopicsList = {
      "type": "topic",
      "topic": changedTopic,
      "cluster": log.clusterTemplate,
      "logId": log.id,
      "feedbackComment": (log.comment == "" || log.comment == undefined) == true ? "" : log.comment,
      "version": log.version,
      "existingTopic": log.topic
    }
    if (log.version == 'v1v2') {
      feedbackErrorTopicsList.ratio = log.v1Len / log.v2Len;
    }
    var idValue = this.classifiedLogsList.findIndex(x => x.logId === feedbackErrorTopicsList.logId);
    if (idValue != -1) {
      if (this.classifiedLogsList[idValue].type == "topic") {
        this.classifiedLogsList.splice(idValue, 1);
      }
    }      
    this.classifiedLogsList.push(feedbackErrorTopicsList);
  }
  

  saveCriticalityComments() {
    var idValue = this.classifiedLogsList.findIndex(x => x.logId === this.selectedClusterInfo.id && x.type === "topic");
    this.classifiedLogsList[idValue].feedbackComment = this.comments;
    this.comments=""
  };

//function to  update cluster Comments
  saveClusterTagComments() {
    var idValue = this.classifiedLogsList.findIndex(x => x.logId === this.selectedClusterInfo.logId && x.type === "topic");
    this.classifiedLogsList[idValue].comment = this.clusterComments;
    this.clusterComments = ""
  };

  //function calling when cluster tag value changes
  changeClusterTag(e, log, value, clusterTag) {
    this.tagCommentNotificationMessage = "Reclassification Comments";
    setTimeout(function () {
      this.tagCommentNotificationMessage = "";
    }.bind(this), 5000);        
    this.selectedClusterInfo = log;
    if(clusterTag == undefined || clusterTag == null){
      clusterTag = "";
    }
    // log.isClassified = true;
    var clusterTagChangeObj: any = {};
    clusterTagChangeObj = {
      "type": "tag",
      "tag": value,
      "cluster": log.clusterTemplate,
      "logId": log.id,
      "comment": clusterTag,
      "version": log.version,
      "existingTag": log.clusterTagInfo.tag,
      "clusterIdHash": log.clusterTagInfo.clusterIdHash
    }

    var idValue = this.classifiedLogsList.findIndex(x => x.logId === clusterTagChangeObj.logId);
    if (idValue != -1) {
      this.classifiedLogsList[idValue].comment = clusterTag;
      if (this.classifiedLogsList[idValue].type == "tag") {
        this.classifiedLogsList.splice(idValue, 1);
      }
    }
    this.classifiedLogsList.push(clusterTagChangeObj);

  };

  onClickLogEventTab(eventTab) {
    this.logAnalysisData = undefined;
    this.clusterId = null;
    this.eventTab = eventTab;
    this.eventTabLabeledBy = eventTab + '-tab';
    this.store.dispatch(LogAnalysisAction.loadEventLogResults({ canaryId: this.canaryId, serviceId: this.serviceId, event: eventTab }));
    this.enterdToLogLines.emit(true);
    if (this.showChart) {
      this.chartSize = "1px";
      setTimeout(() => {
        if(this.ChartSize != undefined){
          this.chartSize =this.ChartSize.nativeElement.offsetWidth;
        }
      }, 500)
    }
    if (this.LogClusterWidth) {
      this.logClusterWidth = "1px"
      setTimeout(() => {
        if(this.LogClusterWidth != undefined){
          this.logClusterWidth = this.LogClusterWidth.nativeElement.offsetWidth + "px";
        }          
      }, 500)
    }
    
  }

  // Below function is use to show or hide the bubble chart
  toggleGraph(event) {
    this.showChart = !this.showChart;
    if (this.showChart) {
      event.currentTarget.childNodes[0].style.transform = 'rotate(0deg)';
    } else {
      event.currentTarget.childNodes[0].style.transform = 'rotate(-90deg)';
    }
  }

  // Below function is use to colapse and expand templates on click of collapse or expand link
  onChangeTemplateState() {
    if (this.switchToState === "Collapse All") {
      this.switchToState = "Expand All";
    } else {
      this.switchToState = "Collapse All";
    }
    //setTimeout(() => {
      // if(this.expColBtn != undefined){
      //   this.expColBtn.nativeElement.click();
      // }
      // below condtion is use to collapse all template.
      // if (this.switchToState === "Expand All") {
      //   setTimeout(() => {
      //     if(this.elRef != undefined && this.expColBtn != undefined ){
      //       this.elRef.nativeElement.querySelector(this.expColBtn.nativeElement.dataset.target).classList.remove('show');
      //     }          
      //   }, 400)
      // }
      // if (this.switchToState === "Collapse All") {
      //   setTimeout(() => {
      //     if(this.elRef != undefined && this.expColBtn != undefined ){
      //       this.elRef.nativeElement.querySelector(this.expColBtn.nativeElement.dataset.target).classList.add('show');
      //     }          
      //   }, 400)
      // }
    //})
  }

  // Below function is use to assign dynamic id
  assignId(idObj) {
    if (this.switchToState === "Collapse All") {
      return 'log';
    } else {
      return 'log' + idObj;
    }
  }
  //Function to rerun logs after reclassification
  rerunLogs() {
    var postDataToRerun = {
      "feedbackErrorTopics": this.classifiedLogsList,
      "sensitivity": this.selectedSensitivity
    };
    this.rerunResponse = {};    
    this.store.dispatch(LogAnalysisAction.rerunLogs({ logTemplate: this.logTemplate, canaryId: this.canaryId, serviceId: this.serviceId, postData: postDataToRerun }));    
  }
  plotRollOver($event) {
    this.clusterId = $event.dataObj.x

    document.getElementById(this.clusterId).scrollIntoView({
      block:"center" 
      
    });

  }

  showMoreCluster(log) {
    let clusterId = log.id;
    let version = log.version;
    this.logId = log.id;
    this.store.dispatch(LogAnalysisAction.fetchClusterLogData({ canaryId: this.canaryId, serviceId: this.serviceId, clusterId: clusterId, version: version }));
    
  }

  showLessCluster(log) {
    this.showFullLogLine[log.id] = false;
  }
  initialized($event) {
    this.chart = $event.chart; // Storing the chart instance
  }
  closeTimeAnalysis(){
    this.isShow=false;
  }
  timeAnalysisGraph(log){
    this.isShow=true;
    this.dataSourceColumnChart["data"]=[];
    let clusterId:any = log.id;
    let version:any =log.version;
    this.slectedTimeAnalysis = clusterId
     
    this.store.dispatch(LogAnalysisAction.fetchTimeAnalysisGraphData({canaryId: this.canaryId, serviceId: this.serviceId, clusterId:clusterId ,version:version }));    
    this.store.select(fromFeature.selectLogAnalysisState).subscribe(
      (resData1) => {
        if(resData1.timeStampData !== null){
          this.timeStampResponse = {
            timestamps: resData1.timeStampData.timestamps
          };
          if (this.timeStampResponse.timestamps.length > 0) {
            this.timeAnalysisBarChartBuckets(this.timeStampResponse.timestamps, this.slectedTimeAnalysis);
          }
            
        }
      })
  
  }
  timeAnalysisBarChartBuckets(timestamp:any,renderId:any){
    let timeInMillisecondsArray:any[]=[];
    let logsDuration:any=null
    let startTime:any=null
    let endTime:any=null
   
    logsDuration =  this.logAnalysisResults.duration
     startTime = this.logAnalysisResults.version2StartTime;
     endTime = this.logAnalysisResults.version2EndTime;
        //getting seconds from startTime 
        var sSec = new Date(startTime).getSeconds();
        //getting miniutes start of startTime ie. the starting bucket 
        var miniuteStartOfStartTime = startTime - (sSec * 1000);
        //getting seconds from endTime 
        var eSec = new Date(endTime).getSeconds();
        //getting miniutes start of endTime ie. the end bucket 
        var miniuteStartOfEndTime = endTime - (eSec * 1000);
        var miniutesBucketArray = [];
        var nextMinuteStart = miniuteStartOfStartTime;
        miniutesBucketArray.push(miniuteStartOfStartTime);
        for (var i = 1; i <= logsDuration; i++) {
            if (nextMinuteStart <= miniuteStartOfEndTime) {
                //next minute in milliseconds - startminute + 60000
                nextMinuteStart = nextMinuteStart + 60000;
                miniutesBucketArray.push(nextMinuteStart);
            }
        }
        miniutesBucketArray.push(miniuteStartOfEndTime + 60000);
        //preparing array as buckets of nearest elements also added count
        var bucketsOfMinutes = [];
        for (var i = 0; i < miniutesBucketArray.length - 1; i++) {
            var prev = i;
            var next = i + 1;
            var obj = {
                bucketStartTime: miniutesBucketArray[prev],
                bucketEndTime: miniutesBucketArray[next],
                repeatedCount: 0
            };
            bucketsOfMinutes.push(obj);
        }
        
        
      timestamp.forEach(function (value) {
        var obj = {
          "timeInMillis": Date.parse(value)
      };
      timeInMillisecondsArray.push(obj);
      });
      
      timeInMillisecondsArray.sort()

    timeInMillisecondsArray.forEach(function (timestamp) {
      for (var i = 0; i < bucketsOfMinutes.length; i++) {
        if (bucketsOfMinutes[i].bucketStartTime <= timestamp.timeInMillis && timestamp.timeInMillis <= bucketsOfMinutes[i].bucketEndTime) {
            bucketsOfMinutes[i].repeatedCount = bucketsOfMinutes[i].repeatedCount + 1;
            break;
        }
    }
    }); 
    var chartRows = [];
    var eachChartRow = [];
    var dataobjTimeseries:any;
    var tempRepeat:any;
    var toolTip:any;
    this.dataSourceColumnChart["data"]=[];
    for (var i = 0; i < bucketsOfMinutes.length; i++) {
     
        eachChartRow = [new Date(bucketsOfMinutes[i].bucketStartTime), bucketsOfMinutes[i].repeatedCount,new Date(bucketsOfMinutes[i].bucketStartTime).getHours()+":"+new Date(bucketsOfMinutes[i].bucketStartTime).getMinutes()];
         chartRows.push(eachChartRow)
         toolTip = new Date(bucketsOfMinutes[i].bucketStartTime).toLocaleString()
         console.log(typeof(toolTip));
         if(bucketsOfMinutes[i].repeatedCount==0)
         {
          tempRepeat=""
         }
         else
         {
          tempRepeat=bucketsOfMinutes[i].repeatedCount
         }
         let myobj = {
          label: new Date(bucketsOfMinutes[i].bucketStartTime).getHours()+":"+new Date(bucketsOfMinutes[i].bucketStartTime).getMinutes(),
          value: tempRepeat,
          tooltext:new Date(bucketsOfMinutes[i].bucketStartTime).toLocaleString()+'<br><br>'+"Repetition: &nbsp;"+tempRepeat
         }
         this.dataSourceColumnChart["data"].push(myobj)
    };
    

  }

  reset(){
    if(this.eventTab == 'unexpected'){
      this.getLogAnalysis();
    }else{
      this.onClickLogEventTab(this.eventTab);
    }
    this.classifiedLogsList = [];
  }
  sortByLength(arrayname:any){
    return arrayname.sort(function(a, b) {
      return b.length - a.length;
    });
  }

  // for getting reclassification history data
  getReclassifiactionHistory(){
    this.store.dispatch(LogAnalysisAction.fetchReclassificationHistoryData({ logTemplateName: this.logAnalysisResults.templateName }));
    this.store.select(fromFeature.selectLogAnalysisState).subscribe(
      (resData) => {
        if (resData.reclassificationHistoryResults != null) {
            }
            
      });
  }

  expColCluster(logId){

    if($("#log"+logId ).hasClass("show"))
    {
      $("#log"+logId).removeClass("show")
      $("#upArrow"+logId).removeClass("show")
      $("#upArrow"+logId).addClass("hide")
      $("#downArrow"+logId).removeClass("hide")
      $("#downArrow"+logId).addClass("show")
    }else{
      $("#log"+logId).addClass("show")
      $("#upArrow"+logId).addClass("show")
      $("#upArrow"+logId).removeClass("hide")
      $("#downArrow"+logId).removeClass("show")
      $("#downArrow"+logId).addClass("hide")
    }
    
  }
}
