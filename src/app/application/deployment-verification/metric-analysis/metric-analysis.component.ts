import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFeature from '../store/feature.reducer';
import { SharedService } from '../../../services/shared.service';
import * as MetricAnalysisActions from './store/metric-analysis.actions';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-metric-analysis',
  templateUrl: './metric-analysis.component.html',
  styleUrls: ['./metric-analysis.component.less']
})
export class MetricAnalysisComponent implements OnInit {

  @ViewChild('stickyMenu') menuElement: ElementRef;

  menuWidth: any;                                                     // It is use to store offsetTop of matric table.
  menuTop:number = 160;                                               // It define top of metric table.
  sticky: boolean = false;                                            // It is use to perform operation whether matric menu is sticky or not. 
  metricData:any;                                                     // It is use to store data of whole metric analysis.
  APMMetricData = [];                                                 // It is use to store APM metric Data.
  InfraMetricData = [];                                               // It is use to store Infra Metric Data.
  AdvancedMetricData = [];                                            // It is use to store Advanced Metric Data.
  searchData = '';                                                    // It is use to perform search on whole table.
  minScore = 60;
  maxScore = 80;

  constructor(private sharedServices: SharedService,
              public store: Store<fromFeature.State>) { }
  
  ngOnInit(){
    this.store.dispatch(MetricAnalysisActions.loadMetricAnalysis());
    
    //fetching data from deployment verification state
    this.store.select(fromFeature.selectMetricAnalysisState).subscribe(
      (resdata)=>{
        if(resdata.canaryOutputData !== null){
          this.metricData = resdata['canaryOutputData'];
          this.metricData.canary_output.results.forEach((metricData) => {
            switch(metricData.category){
              case 'APM':
                this.APMMetricData.push(metricData);
                break;
              case 'Infra':
                this.InfraMetricData.push(metricData);
                break;
              case 'Advanced':
                this.AdvancedMetricData.push(metricData);
                break;
            }
          });
          console.log("Apm",this.APMMetricData);
          console.log("Infra",this.InfraMetricData);
          console.log("Advanced",this.AdvancedMetricData);
        }
      }
    )
  }

  // Below function is use to capture events occur in matric analysis component and make responsive to table.
 
  //@HostListener('window:mousemove', ['$event'])
  @HostListener('window:click', ['$event'])
  @HostListener('window:scroll', ['$event'])
    handleScroll(){
      setTimeout(() =>{
        this.menuWidth = this.menuElement.nativeElement.offsetWidth +'px';
      },500)
        const windowScroll = window.pageYOffset;
        if(windowScroll >= this.menuTop){
            this.sticky = true;
        } else {
            this.sticky = false;
        }
    }

  // Below function is use to calculate average score of apm metric column.
  AvgerageScore(index,type){
    let counter = 0;
    let typeScore = 0;
    this.APMMetricData[index].metricList.forEach(metricElement => {
      if(metricElement.label === type){
        typeScore = typeScore + metricElement.metricScore;
        counter++;
      }
    });
    const averageScore = typeScore/counter;
    const assignedColor = this.assignProperColor(averageScore);
    return assignedColor + 'btn';
  }

  // Below function is use to return appropriate color on the basics of matric score calculation
  assignProperColor(score){
    if(score === 0 || score === undefined){
      return 'countDisabled';
    } else if(score<this.minScore){
      return 'countDanger';
    } else if(score>this.minScore && score<this.maxScore){
      return 'countWarning';
    } else if(score>this.maxScore){
      return 'countSuccess';
    }
  } 

}
