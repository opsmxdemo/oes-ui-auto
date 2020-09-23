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

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.savedCheckedData)
  }

  ngOnInit(): void {
    debugger;
  }
  onCheckBoxClicked(){
    this.addLogData.emit(this.dynamicForm.value);
    debugger;
  }
  

}
