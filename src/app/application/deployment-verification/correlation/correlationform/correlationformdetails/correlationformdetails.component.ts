import { Component, OnInit, Input, ViewChild, Output, EventEmitter, QueryList, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-correlationformdetails',
  templateUrl: './correlationformdetails.component.html',
  styleUrls: ['./correlationformdetails.component.less']
})
export class CorrelationformdetailsComponent implements OnInit {
  @ViewChild('selectedLogsForm') dynamicForm: NgForm;
  @ViewChild("checkboxes") checkboxes: QueryList<ElementRef>;
  @Output() addLogData = new EventEmitter<boolean>();
  @Input() data:any;

  constructor() { }

  ngOnInit(): void {
  }
  onCheckBoxClicked(){
    this.addLogData.emit(this.dynamicForm.value);
  }
  clearCheckBoxes(){
    this.checkboxes.forEach(element => {
      element.nativeElement.checked = false;
    });
    
  }

}
