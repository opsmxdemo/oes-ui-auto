import { Component, OnInit, Input, ViewChild, Output, EventEmitter, QueryList, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';


@Component({
  selector: 'app-correlationformdetails',
  templateUrl: './correlationformdetails.component.html',
  styleUrls: ['./correlationformdetails.component.less']
})
export class CorrelationformdetailsComponent implements OnInit,OnChanges {
  @ViewChild('selectedLogsForm') dynamicForm: NgForm;
  @ViewChild("checkboxes") checkboxes: QueryList<ElementRef>;
  @Output() addLogData = new EventEmitter<boolean>();
  @Input() data:any;
  @Input() savedCheckedData:any;
  @Input() flag:any;
  expression:any=true;
  modelCritical:boolean=false;
  modelError:boolean=false;
  modelWarn:boolean=false;
  criticalKeysLength:any;
  errorKeysLength:any;
  warnKeysLength:any;
  matricKeysLength:any;
  

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.flag=="log")
    {
      this.criticalKeysLength=0
      this.errorKeysLength=0
      this.warnKeysLength=0
      
      var criticalKeys = Object.keys(this.savedCheckedData.Critical)
      var ErrorKeys = Object.keys(this.savedCheckedData.ERROR)
      var WarningKeys = Object.keys(this.savedCheckedData.Warn)
      
    for(var i =0;i<this.data.length;i++)
    {
      if(this.data[i].topic == "CRITICAL ERROR")
      {
        this.criticalKeysLength=1;
      }
      if(this.data[i].topic == "ERROR")
      {
        this.errorKeysLength=1;
      }
      if(this.data[i].topic == "WARN")
      {
        this.warnKeysLength=1;
      }
    }
      

      var counterCritical = 0
      var counterError = 0
      var counterWarn = 0
        for(var i=0;i< criticalKeys.length;i++)
      {
        counterCritical++
        if(this.savedCheckedData['Critical'][criticalKeys[i]]==false || this.savedCheckedData['Critical'][criticalKeys[i]]==undefined )
        {
          this.savedCheckedData['groupCritical']=false
          break;
        }
        else{
          this.savedCheckedData['groupCritical']=true
        }
      }
      for(var i=0;i< ErrorKeys.length;i++)
      {
        counterError++
        if(this.savedCheckedData['ERROR'][ErrorKeys[i]]==false || this.savedCheckedData['ERROR'][ErrorKeys[i]]==undefined )
        {
          this.savedCheckedData['groupError']=false
          break;
        }
        else{
          this.savedCheckedData['groupError']=true
        }
      }
      for(var i=0;i< WarningKeys.length;i++)
      {
        counterWarn++
        if(this.savedCheckedData['Warn'][WarningKeys[i]]==false || this.savedCheckedData['Warn'][WarningKeys[i]]==undefined )
        {
          this.savedCheckedData['groupWarn']=false
          break;
        }
        else{
          this.savedCheckedData['groupWarn']=true
        }
      }
      if(counterCritical==0)
      {
        this.savedCheckedData['groupCritical']=false
      }
      if(counterError==0)
      {
        this.savedCheckedData['groupError']=false
      }
      if(counterWarn==0)
      {
        this.savedCheckedData['groupWarn']=false
      }
    }
    else if(this.flag=="metric")
    {
      this.matricKeysLength=0
      var metricKeys = Object.keys(this.savedCheckedData.metric)
      if(this.data.length>0)
      {
        this.matricKeysLength=1
      }
      
      
      var counterMetric = 0
      
      for(var i=0;i< metricKeys.length;i++)
      {
        counterMetric++
        if(this.savedCheckedData['metric'][metricKeys[i]]==false || this.savedCheckedData['metric'][metricKeys[i]]==undefined)
        {
          this.savedCheckedData['groupMetric']=false
          break;
        }
        else{
          this.savedCheckedData['groupMetric']=true
        }
      }
    

    
    
      if(counterMetric==0)
      {
        this.savedCheckedData['groupMetric']=false
      }
    }
      
      
    
  }


  ngOnInit(): void {
    

  }
  onCheckBoxClicked(){
    $("[data-toggle='tooltip']").tooltip('hide');
    this.addLogData.emit(this.dynamicForm.value);
    this.savedCheckedData=this.dynamicForm.value
    if(this.flag=="log")
    {
      var criticalKeys = Object.keys(this.savedCheckedData.Critical)
      var ErrorKeys = Object.keys(this.savedCheckedData.ERROR)
      var WarningKeys = Object.keys(this.savedCheckedData.Warn)
      
        for(var i=0;i< criticalKeys.length;i++)
      {
        
        if(this.savedCheckedData['Critical'][criticalKeys[i]]==false || this.savedCheckedData['Critical'][criticalKeys[i]]==undefined )
        {
          this.savedCheckedData['groupCritical']=false
          break;
        }
        else{
          this.savedCheckedData['groupCritical']=true
        }
      }
      for(var i=0;i< ErrorKeys.length;i++)
      {
        
        if(this.savedCheckedData['ERROR'][ErrorKeys[i]]==false || this.savedCheckedData['ERROR'][ErrorKeys[i]]==undefined )
        {
          this.savedCheckedData['groupError']=false
          break;
        }
        else{
          this.savedCheckedData['groupError']=true
        }
      }
      for(var i=0;i< WarningKeys.length;i++)
      {
        
        if(this.savedCheckedData['Warn'][WarningKeys[i]]==false || this.savedCheckedData['Warn'][WarningKeys[i]]==undefined )
        {
          this.savedCheckedData['groupWarn']=false
          break;
        }
        else{
          this.savedCheckedData['groupWarn']=true
        }
      }
    
    }
    else if(this.flag=="metric")
    {
      var metricKeys = Object.keys(this.savedCheckedData.metric)
      
      for(var i=0;i< metricKeys.length;i++)
      {
       
        if(this.savedCheckedData['metric'][metricKeys[i]]==false || this.savedCheckedData['metric'][metricKeys[i]]==undefined)
        {
          this.savedCheckedData['groupMetric']=false
          break;
        }
        else{
          this.savedCheckedData['groupMetric']=true
        }
      }
    
    }    
  
    
  }
  onselectAllCritical(event){
    $("[data-toggle='tooltip']").tooltip('hide');
    var CheckedValue = event.target.checked
    this.savedCheckedData = this.dynamicForm.value;
    var criticalKeys = Object.keys(this.savedCheckedData.Critical)
    if(CheckedValue==true)
    {
      
      
      for(var i = 0;i<criticalKeys.length;i++)
      {
        this.savedCheckedData['Critical'][criticalKeys[i]]=true;
      }
      this.addLogData.emit(this.savedCheckedData);
      
    }
    else{
      for(var i = 0;i<criticalKeys.length;i++)
      {
        this.savedCheckedData['Critical'][criticalKeys[i]]=false;
      }
      this.addLogData.emit(this.savedCheckedData);
    }
  }

  onselectAllError(event){
    $("[data-toggle='tooltip']").tooltip('hide');
    var CheckedValue = event.target.checked
    this.savedCheckedData = this.dynamicForm.value;
    var ErrorKeys = Object.keys(this.savedCheckedData.ERROR)
    if(CheckedValue==true)
    {
      
      
      for(var i = 0;i<ErrorKeys.length;i++)
      {
        this.savedCheckedData['ERROR'][ErrorKeys[i]]=true;
      }
      this.addLogData.emit(this.savedCheckedData);
      
    }
    else{
      for(var i = 0;i<ErrorKeys.length;i++)
      {
        this.savedCheckedData['ERROR'][ErrorKeys[i]]=false;
      }
      this.addLogData.emit(this.savedCheckedData);
    }
  }

  onselectAllWarn(event){
    $("[data-toggle='tooltip']").tooltip('hide');
    var CheckedValue = event.target.checked
    this.savedCheckedData = this.dynamicForm.value;
    var WarnKeys = Object.keys(this.savedCheckedData.Warn)
    if(CheckedValue==true)
    {
      
      
      for(var i = 0;i<WarnKeys.length;i++)
      {
        this.savedCheckedData['Warn'][WarnKeys[i]]=true;
      }
      this.addLogData.emit(this.savedCheckedData);
      
    }
    else{
      for(var i = 0;i<WarnKeys.length;i++)
      {
        this.savedCheckedData['Warn'][WarnKeys[i]]=false;
      }
      this.addLogData.emit(this.savedCheckedData);
    }
  }

  onselectAllMetric(event){
    $("[data-toggle='tooltip']").tooltip('hide');
    var CheckedValue = event.target.checked
    this.savedCheckedData = this.dynamicForm.value;
    var metricKeys = Object.keys(this.savedCheckedData.metric)
    if(CheckedValue==true)
    {
      
      
      for(var i = 0;i<metricKeys.length;i++)
      {
        this.savedCheckedData['metric'][metricKeys[i]]=true;
      }
      this.addLogData.emit(this.savedCheckedData);
      
    }
    else{
      for(var i = 0;i<metricKeys.length;i++)
      {
        this.savedCheckedData['metric'][metricKeys[i]]=false;
      }
      this.addLogData.emit(this.savedCheckedData);
    }
  }
  
  
  

}
