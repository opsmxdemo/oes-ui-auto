import { Component, OnInit, Input, ViewChild, Output, EventEmitter, QueryList, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';


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

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    var criticalKeys = Object.keys(this.savedCheckedData.Critical)
    var ErrorKeys = Object.keys(this.savedCheckedData.ERROR)
    var WarningKeys = Object.keys(this.savedCheckedData.Warn)
    
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


  ngOnInit(): void {
    

  }
  onCheckBoxClicked(){
    this.addLogData.emit(this.dynamicForm.value);
    this.savedCheckedData=this.dynamicForm.value
    var criticalKeys = Object.keys(this.savedCheckedData.Critical)
    var ErrorKeys = Object.keys(this.savedCheckedData.ERROR)
    var WarningKeys = Object.keys(this.savedCheckedData.Warn)
    
    
    for(var i=0;i< criticalKeys.length;i++)
    {
      if(this.savedCheckedData['Critical'][criticalKeys[i]]==false || this.savedCheckedData['Critical'][criticalKeys[i]]==undefined)
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
      if(this.savedCheckedData['ERROR'][ErrorKeys[i]]==false || this.savedCheckedData['ERROR'][ErrorKeys[i]]==undefined)
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
      if(this.savedCheckedData['Warn'][WarningKeys[i]]==false || this.savedCheckedData['Warn'][WarningKeys[i]]==undefined)
      {
        this.savedCheckedData['groupWarn']=false
        break;
      }
      else{
        this.savedCheckedData['groupWarn']=true
      }
    }
    
  
    
  }
  onselectAllCritical(event){
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
  
  checkSelectAllState(recentCheckedData){
    
  }
  

}
