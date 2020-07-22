import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFeature from '../store/feature.reducer';
import { SharedService } from '../../../services/shared.service';
import * as MetricAnalysisActions from './store/metric-analysis.actions';


@Component({
  selector: 'app-metric-analysis',
  templateUrl: './metric-analysis.component.html',
  styleUrls: ['./metric-analysis.component.less']
})
export class MetricAnalysisComponent implements OnInit {

  @ViewChild('stickyMenu') menuElement: ElementRef;
  @ViewChild('subChartSize') subChartSize: ElementRef;

  menuWidth: any;                                                     // It is use to store offsetTop of matric table.
  menuTop:number = 160;                                               // It define top of metric table.
  sticky: boolean = false;                                            // It is use to perform operation whether matric menu is sticky or not. 
  metricData:any;                                                     // It is use to store data of whole metric analysis.
  APMMetricData = [];                                                 // It is use to store APM metric Data.
  InfraMetricData = [];                                               // It is use to store Infra Metric Data.
  AdvancedMetricData = [];                                            // It is use to store Advanced Metric Data.
  searchData = '';                                                    // It is use to perform search on whole table.
  minScore = 60;                                                      // It is use to store minimum threshold value.
  maxScore = 80;                                                      // It is use to store maximum threshold value.
  apmMetricSelectedRow = -1;                                          // It is use to store index of selected row in apm metric table.
  apmMetricSelectedType = '';                                         // It is use to store Type of column selected in apm metric table.

  // Below variable is use in graph section

  metricType = '';                                                    // It is use to store value of MetricType showing data in graph section.
  currentChartData = [];                                              // It is use to store all graph data nedd to display in graph section.
  chartSize: any[];                                                   // It is use to store graph width on change of layout widyh.
  lineChartProperty = {                                               // It is use to stote all line chart related properties.
    showLegend: true,
    animations: true,
    showXAxis: true,
    showYAxis: true,
    showYAxisLabel: false,
    showXAxisLabel: true,
    xAxisLabel: 'Time',
    timeline: true,
    colorScheme:{domain: ['#33b3f1','#f29798']}
  }
  typeColor = '';                                                      // It is use to store style class of current active metric type.


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
          if(this.APMMetricData.length>0){
            if(this.apmMetricSelectedRow === -1 && this.apmMetricSelectedType === ''){
              this.onClickAPMRow(0,null,'Latency');
            }
          }
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
        this.chartSize = [this.subChartSize.nativeElement.offsetWidth,300]
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

  // Below function is execute on click of apm metric table row
  onClickAPMRow(rowIndex,event,id){
    this.apmMetricSelectedRow = rowIndex;
    this.metricType = 'APM';
    let chartsData = []; 
    if(event !== null){
      this.apmMetricSelectedType = event.target.id;
      this.typeColor = event.target.parentNode.classList[0];
    }else{
      this.apmMetricSelectedType = id;
      this.typeColor = this.AvgerageScore(rowIndex,id);
    }
    this.APMMetricData[rowIndex].metricList.forEach(metricListData => {
      if(this.apmMetricSelectedType === metricListData.label){
        chartsData.push(metricListData.scatterData);
      }
    });
    this.formLineChartData(chartsData);
  }

  // Below function is use to set date in chart data if timestamp exist and form proper expected object for line chart.
  formLineChartData(chartsData){
    this.currentChartData = [];
    let updatedChartData = [];
    if(chartsData.length > 0){
      chartsData.forEach((chartdata,chartIndex) => {
        let SubChartData = [];
        if(chartdata.version1 !== undefined){
          let baseLineData = {
            name:"Baseline",
            series:[]
          };
          for(const axisData in chartdata.version1.data){
            const coordinatesData = {
              value:chartdata.version1.data[axisData].y,
              name:new Date(chartdata.version1.data[axisData].x)
            };
            baseLineData.series[axisData] = coordinatesData;
          }
          SubChartData.push(baseLineData);
        }
        if(chartdata.version2 !== undefined){
          let newReleaseData = {
            name:"New Release",
            series:[]
          };
          for(const axisData in chartdata.version2.data){
            const coordinatesData = {
              value:chartdata.version2.data[axisData].y,
              name:new Date(chartdata.version2.data[axisData].x)
            };
            newReleaseData.series[axisData] = coordinatesData;
          }
          SubChartData.push(newReleaseData);
        }
        updatedChartData[chartIndex] = SubChartData;
      })
    }
    this.currentChartData = updatedChartData;
  }



}
