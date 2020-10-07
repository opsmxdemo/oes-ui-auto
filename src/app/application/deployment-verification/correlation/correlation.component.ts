import { Component, OnInit, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';           // for ngx bootstrap
import {FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import * as CorrelationAction from './store/correlation.actions';
import * as fromFeature from '../store/feature.reducer';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-correlation',
  templateUrl: './correlation.component.html',
  styleUrls: ['./correlation.component.less']
})
export class CorrelationComponent implements OnInit,OnChanges {
  @Input() canaryId: any[];
  @Input() serviceId: any[];
  @Input() serviceList: any[];
  @ViewChild ("closeButtonLogLines") closebtn:ElementRef;
  @ViewChild ("chartClickRef") chartbtn:ElementRef;
  @ViewChild('subChartSize') subChartSize: ElementRef;
  config:any={
    width:"100%",
    height:150
  }
  modalRef: BsModalRef;                                                      // for modal
  dataSource:any=[]
  dummydata:any;
  showPopUpForLogs:boolean=false;                                           // for showing popup when clicked on bar chart
  zone: any;
  clusterLogs:any;
  addLogs : FormGroup;
  initaladdLogData:any;
  initialaddMetricData:any;
  allMetricsData
  unexpectedClusters:any;
  addedData:any;
  ClickedTimeStamp:any;
  splittedLogLines:any=[]
  stringAdd = ""
  selectedServiceId:any;
  selectedServiceName:any;
  addLogsJson:any=[];
  addMetricJson:any=[];
  counter:any=0;
  metricCounter:any=0;
  addnewlogdummyJson:any
  addFlag:any;
  dummydataForTimeAnalysisComponent:any
  selectedServiceIndex:any;
  dummydataForPopup:any
  lineChartProperty = {                                               // It is use to stote all line chart related properties.
    showLegend: true,
    animations: true,
    showXAxis: true,
    showYAxis: true,
    showYAxisLabel: false,
    showXAxisLabel: true,
    xAxisLabel: 'Time',
    yAxisLabel:'',
    timeline: true,
    
  }
  linechartSize: any[]
  CorrelationflagForLineChart:boolean=true;
  lineChartData:any
  dataForMetricComponentChart:any;
  constructor(public store: Store<fromFeature.State>,private modalService: BsModalService,private _formBuilder: FormBuilder) { }

  // for opening the modal 
  openModal(template: TemplateRef<any>,selectedAddButton) {
    if(this.addFlag=='log')
    {
      this.store.dispatch(CorrelationAction.fetchUnxepectedClusters({ canaryId: this.canaryId, serviceId: this.serviceList[this.selectedServiceIndex].serviceId }));
    }
    else if(this.addFlag=='metric')
    {
      this.store.dispatch(CorrelationAction.allMetrics({ canaryId: this.canaryId, serviceId: this.serviceList[0].serviceId }));
    }
    this.modalRef = this.modalService.show(template);
    this.addFlag = selectedAddButton
  }

  
  
  ngOnChanges(changes: SimpleChanges): void {

    
   
    this.dataSource=[]
  

    // making json for bar chart which shows time analysis graph
    if(this.dummydata!=undefined)
    {
      for(let i=0;i<this.dummydata.analysisData.length;i++)
      {
      let obj =  {
        chart:{
        "numDivlines": "2",
        xaxisname: "Time",
        yaxisname: "Repetition",
        theme: "fusion"
      },
      data:[]
      }
      this.dataSource.push(obj)
      for(let j=0;j<this.dummydata.analysisData[i].data.length;j++)
      {
        var time = new Date(this.dummydata.analysisData[i].data[j].label).getHours()+ ":" + new Date(this.dummydata.analysisData[i].data[j].label).getMinutes()
        var obj1 = {
          label:time,
          value:this.dummydata.analysisData[i].data[j].value,
          tooltext:new Date(this.dummydata.analysisData[i].data[j].label).toLocaleString()+'<br><br>'+"Repetition: &nbsp;"+this.dummydata.analysisData[i].data[j].value
        }
        this.dataSource[i]['data'].push(obj1)
      }
    }
    }
    this.ngOnInit()
   

}

  ngOnInit(): void {

    this.addLogsJson=[]
    this.addMetricJson=[]
    this.counter=0;
    this.metricCounter=0;
    
    
    
    for(let i=0;i<this.serviceList.length;i++)
    {
      let myobj={
        serviceId:this.serviceList[i].serviceId,
        data:{'Critical':{},'ERROR':{},'Warn':{}}
      }

      let myobjMetric={
        serviceId:this.serviceList[i].serviceId,
        data:{'metric':{}}
      }
      this.addLogsJson.push(myobj)
      this.addMetricJson.push(myobjMetric)
      if(this.serviceList[i].serviceId==this.serviceId)
      {
        this.selectedServiceIndex=i;
      }
    }
    
   
  
    
    
    this.store.dispatch(CorrelationAction.fetchUnxepectedClusters({ canaryId: this.canaryId, serviceId: this.serviceId }));
     this.store.dispatch(CorrelationAction.allMetrics({ canaryId: this.canaryId, serviceId: this.serviceId }));
    this.store.select(fromFeature.selectCorrelationState).subscribe(
      (resData) => {
        if(resData.unexpectedClusters != null)
        {
          
          this.unexpectedClusters=resData.unexpectedClusters;
          // saving the clusteId whose chart we want to display 
          var clusters=[]

          this.initaladdLogData={
            "riskAnalysisId": this.canaryId,
            "serviceClusters": [{
              "serviceId": this.serviceId,
              "clusterIds": []
            }]
          }
          for(let i=0;i<this.unexpectedClusters.length;i++)
          {
            if(this.unexpectedClusters[i].topic != "WARN")
            {
             clusters.push(this.unexpectedClusters[i].clusterId)
            }
              if(this.counter==0)
              {
                if(this.unexpectedClusters[i].topic=="CRITICAL ERROR")
                {
                  this.addLogsJson[this.selectedServiceIndex]['data']['Critical'][this.unexpectedClusters[i].clusterId]=true
                }
                if(this.unexpectedClusters[i].topic=="ERROR")
                {
                  this.addLogsJson[this.selectedServiceIndex]['data']['ERROR'][this.unexpectedClusters[i].clusterId]=true
                }
                if(this.unexpectedClusters[i].topic=="WARN")
                {
                  this.addLogsJson[this.selectedServiceIndex]['data']['Warn'][this.unexpectedClusters[i].clusterId]=false;
                }
                
              } 
              
          }
          
         // console.log(this.initaladdLogData)
          this.initaladdLogData.serviceClusters[0].clusterIds=clusters;
          if(this.initaladdLogData.serviceClusters[0].clusterIds.length > 0 && this.counter==0)
          {
            this.store.dispatch(CorrelationAction.timeSeriesData({ postData:this.initaladdLogData}));
            this.counter++
          }
          
        }
        if(resData.allMetricsData != null)
        {
          this.allMetricsData=resData.allMetricsData;
          var clusters=[]
          this.initialaddMetricData={
            "riskAnalysisId": this.canaryId,
            "serviceMetrics": [{
              "serviceId": this.serviceId,
              "metricIds": []
            }]
          }
          for(let i=0;i<this.allMetricsData.length;i++)
          {
            clusters.push(this.allMetricsData[i].id)
            if(this.metricCounter==0)
            {
              this.addMetricJson[this.selectedServiceIndex]['data']['metric'][this.allMetricsData[i].id]=true
            }
          }
          
          this.initialaddMetricData.serviceMetrics[this.selectedServiceIndex].metricIds=clusters;

          if(this.initialaddMetricData.serviceMetrics[this.selectedServiceIndex].metricIds.length > 0 && this.metricCounter == 0)
          {
            this.store.dispatch(CorrelationAction.metrictimeSeriesData({ postData:this.initialaddMetricData}));
            this.metricCounter++;
          }
        }

        
        if(resData.timeSeriesData != null)
        {
          
           this.dummydataForTimeAnalysisComponent = resData.timeSeriesData
          
          
        }

        if(resData.metrictimeSeriesData != null)
        {
          
           this.dataForMetricComponentChart = resData.metrictimeSeriesData
            
          
         
          // else{
          //   this.addedData = resData.timeSeriesData
          //   this.dummydataForTimeAnalysisComponent = Object.assign([], this.dummydataForTimeAnalysisComponent);
            
          //   var push:any=true;
            
          //   this.dummydataForTimeAnalysisComponent=this.addedData

          //  }
          
        }
        
        if(resData.clusterData != null && resData.dataLoaded)
        {
          this.store.dispatch(CorrelationAction.clusterDataLoaded());
          this.clusterLogs = resData.clusterData['clusterData']
          this.splitlogLinesFunc();
          
        }
        
        
      })

    //  [{serviceId:2,clusterId;[1,2]},{serviceId:1,clusterId;[3,4]}]
        
    
  }

  // plotRollOver($event) {
    
  // }

  ClosePopUp(){
    this.showPopUpForLogs=false;
  }
  getOpen(clickedClusterData){
    this.store.dispatch(CorrelationAction.clusterData({ canaryId: this.canaryId, serviceId: clickedClusterData.serviceId, clusterId:clickedClusterData.clusterId,ClickedTimeStamp:clickedClusterData.ClickedTimeStamp}));
    
  }
  // for giving the time of particular bar which is clicked. 
  getClickedTimeStamp(ClickedTimeStamp){
    this.ClickedTimeStamp=ClickedTimeStamp
    
  }
  getserviceId(clickedserviceId){
    this.selectedServiceId=clickedserviceId
    for(let i=0;i<this.serviceList.length;i++)
    {
      if(this.serviceList[i].serviceId==this.selectedServiceId)
      {
        this.selectedServiceName = this.serviceList[i].serviceName
      }
    }
  }

  onSelectedServiceChange(selectedservice){
    if(this.addFlag=='log')
    {
      this.store.dispatch(CorrelationAction.fetchUnxepectedClusters({ canaryId: this.canaryId, serviceId: selectedservice }));
    }else if(this.addFlag=='metric')
    {
      this.store.dispatch(CorrelationAction.allMetrics({ canaryId: this.canaryId, serviceId: selectedservice }));
    }
  }
  //getting data from child when submit from add log is clicked.
  onSubmitPostData(addlogdata){
    this.modalService.hide()
    addlogdata.riskAnalysisId=this.canaryId
    
    if(this.addFlag=="log"){
      var addedDataDup1 = {
        "riskAnalysisId":addlogdata.riskAnalysisId,
        "serviceClusters":[]
      }
      for(let i=0;i<addlogdata.serviceClusters.length;i++)
      {
        if(addlogdata.serviceClusters[i].clusterIds.length>0)
        {
          let obj={
            "serviceId":addlogdata.serviceClusters[i].serviceId,
            "clusterIds":addlogdata.serviceClusters[i].clusterIds
          }
          addedDataDup1.serviceClusters.push(obj)
        }
        
      }
      
      this.store.dispatch(CorrelationAction.timeSeriesData({ postData:addedDataDup1}));
    }
    else if(this.addFlag=="metric"){
      var addedDataDup = {
        "riskAnalysisId":addlogdata.riskAnalysisId,
        "serviceMetrics":[]
      }
      for(let i=0;i<addlogdata.serviceMetrics.length;i++)
      {
        if(addlogdata.serviceMetrics[i].metricIds.length>0)
        {
          let obj={
            "serviceId":addlogdata.serviceMetrics[i].serviceId,
            "metricIds":addlogdata.serviceMetrics[i].metricIds
          }
          addedDataDup.serviceMetrics.push(obj)
        }
        
      }
      this.store.dispatch(CorrelationAction.metrictimeSeriesData({ postData:addedDataDup}));
    }
    
    
    
  }
  splitlogLinesFunc(){
    var res = [];
     res = this.clusterLogs.split("DOCUMENT ");
    
    var ClickedTimeStampTrimed = this.ClickedTimeStamp.substring(0,16)
    if(this.closebtn!==undefined){
      this.closebtn.nativeElement.click();
    }
    
    this.splittedLogLines=[];
    
      
      for(let i=0;i<res.length;i++)
    {
      var resTrimed=res[i].substring(0,16)
      if(resTrimed==ClickedTimeStampTrimed)
      {
        this.splittedLogLines.push(res[i]);
        
      }
    }
    
    this.showPopUpForLogs=true;
    this.chartbtn.nativeElement.click();
    
    
  }

  onSubmitsaveData(submitdataToSave){
    if(this.addFlag=="log"){
      this.addLogsJson=submitdataToSave
    }
    else if(this.addFlag=="metric"){
      this.addMetricJson=submitdataToSave
    }
  
    
    
  }

  hideAddLog(event){
    this.modalRef.hide()
  }

  deleteLogChart(deletedchartData){
    var deletedClusterId = deletedchartData.clusterId
    for(let i=0;i<this.addLogsJson.length;i++){
      
        if(deletedchartData.serviceId==this.addLogsJson[i].serviceId){
          
          if(deletedchartData.topics=="CRITICAL ERROR"){
            this.addLogsJson[i]['data']['Critical'][deletedClusterId]=false
          }
          else if(deletedchartData.topics=="ERROR"){
            
            this.addLogsJson[i]['data']['ERROR'][deletedClusterId]=false
          }
          else if(deletedchartData.topics=="WARN"){
            
            this.addLogsJson[i]['data']['Warn'][deletedClusterId]=false

          }
        
      }
      
    }
  }

  deleteMetricChart(deletedchartData){
    
    var deletedClusterId = deletedchartData.clusterId
    for(let i=0;i<this.addMetricJson.length;i++){
      if(deletedchartData.serviceId==this.addMetricJson[i].serviceId){
        this.addMetricJson[i]['data']['metric'][deletedClusterId]=false
      }
    }
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:click', ['$event'])
    handleScroll(){
      
      setTimeout(() =>{
        this.linechartSize = [this.subChartSize.nativeElement.offsetWidth,300]
      },500)
    }
  
  
  
}
