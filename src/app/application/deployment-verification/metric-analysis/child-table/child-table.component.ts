import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child-table',
  templateUrl: './child-table.component.html',
  styleUrls: ['./child-table.component.less'],
})
export class ChildTableComponent implements OnInit {

  @Input() childData: any;
  @Input() searchData: string;
  @Input() selectedType: string;
  @Input() selectedRow: number;
  @Input() selectedMetricName: string;
  @Input() thresholdScore: any;
  @Output() selectedElement = new EventEmitter<any>();

  constructor() { }

  ngOnInit(){}

  // Below function is use to return appropriate color on the basics of matric score calculation
  assignProperColor(score){
    if(score === 0 || score === undefined){
      return 'countDisabled';
    } else if(score < this.thresholdScore['minScore']){
      return 'countDanger';
    } else if(score > this.thresholdScore['minScore'] && score < this.thresholdScore['maxScore']){
      return 'countWarning';
    } else if(score > this.thresholdScore['maxScore']){
      return 'countSuccess';
    }
  } 

  // Below function is execute when click on any table row
  onSelectRow(rowIndex,event,selectedMetricName){
    this.selectedElement.emit({
      type:event.target.parentElement.id,
      selectedMetricName:selectedMetricName,
      index:rowIndex,
      parent:this.childData.name
    });
  }

}
