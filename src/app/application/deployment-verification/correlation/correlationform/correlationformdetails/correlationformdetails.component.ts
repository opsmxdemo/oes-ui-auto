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
    this.modelCritical=false;
    this.modelError=false;
    this.modelWarn=false;
  }


  ngOnInit(): void {
    
  }
  onCheckBoxClicked(){
    this.addLogData.emit(this.dynamicForm.value);
    console.log(this.savedCheckedData)
    console.log(this.dynamicForm.value)
  
    
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
  

}
