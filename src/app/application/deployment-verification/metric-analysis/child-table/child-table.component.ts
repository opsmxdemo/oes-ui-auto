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
    if(score === undefined){
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
  onSelectRow(rowIndex,categoryType,selectedMetricName){
    this.selectedElement.emit({
      type:categoryType,
      selectedMetricName:selectedMetricName,
      index:rowIndex,
      parent:this.childData.name
    });
  }

  // Below function is return interval in form of array after calculating bucket score
  intervalCount(intervalObj){
    let intervalArr = [];
    for(const interval in intervalObj){
      intervalArr.push(intervalObj[interval].score);
    }
    return intervalArr;
  }

  // Below function is use to break long words into smaller parts
  childMetricName(name){
    let metricname = name.split('');
    let transformString = '';
    let counter = 1;
    metricname.forEach((element,index) => {
      if(index === 0){
        transformString += '<span">'+element;
      }else if(counter*45 === index){
        transformString += '</span><br><span>'+element;
        counter++;
      }else if(index === metricname.length-1){
        transformString += element+'</span>'
      }
      else{
        transformString += element;
      }
    });
    return transformString;
  }

}
