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

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    
  }
  onCheckBoxClicked(){
    this.addLogData.emit(this.dynamicForm.value);
   
    
  }
  
  

}
