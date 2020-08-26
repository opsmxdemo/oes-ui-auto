import { Component, OnInit, ViewChild, ElementRef, HostListener, SimpleChanges, OnChanges, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFeature from '../store/feature.reducer';
import { SharedService } from '../../../services/shared.service';
import * as MetricAnalysisActions from './store/metric-analysis.actions';
import { trigger, state, transition, animate, style } from '@angular/animations';


@Component({
  selector: 'app-metric-analysis',
  templateUrl: './metric-analysis.component.html',
  styleUrls: ['./metric-analysis.component.less'],
  animations: [
    trigger('expandableRow', [
      state('collapsed, void', style({
        height: '0px',
        visibility: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        visibility: 'visible'
      })),
      transition(
        'expanded <=> collapsed, void <=> *',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ])
  ]
})
export class MetricAnalysisComponent implements OnInit,OnChanges {

  @ViewChild('stickyMenu') menuElement: ElementRef;
  @ViewChild('subChartSize') subChartSize: ElementRef;

  @Input() canaryId: string;
  @Input() serviceId: number;

  initialCall = true;                                                 // It is use to restrict to calling api at component load.
  statusSearchData = [false,false,false];                             // It is use to store data related to status level checkbox for search.
  coreAPMData = [];                                                   // It is use to store without filtered APM Data.
  coreInfraData = [];                                                 // It is use to store without filtered Infra Data.
  coreAdvancedData = [];                                              // It is use to store without filtered Advanced Data.
  menuWidth: any;                                                     // It is use to store offsetWeidth of matric table.
  menuTop:number = 220;                                               // It define top of metric table.
  sticky: boolean = false;                                            // It is use to perform operation whether matric menu is sticky or not. 
  metricData:any;                                                     // It is use to store data of whole metric analysis.
  APMMetricData = [];                                                 // It is use to store APM metric Data.
  InfraMetricData = [];                                               // It is use to store Infra Metric Data.
  AdvancedMetricData = [];                                            // It is use to store Advanced Metric Data.
  searchData = '';                                                    // It is use to perform search on whole table.
  thresholdScore = {
    minScore:null,                                                    // It is use to store minimum threshold value.
    maxScore:null                                                     // It is use to store maximum threshold value.
  }
  metricSelectedRow = -1;                                             // It is use to store index of selected row in apm metric table.
  apmMetricSelectedType = '';                                         // It is use to store Type of column selected in apm metric table.
  childMetric = {                                                     // It is use to store value of child metric in infra or advanced is hide or visible in nested-row.
    Infra:[],
    Advanced:[]
  };                                              
  childView_rowanimation = 'collapsed';                               // It is use to store value of animation state to represent animation in infra child view.

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
    yAxisLabel:'',
    timeline: true,
    colorScheme:{domain: ['#33b3f1','#f29798']}
  }
  typeColor = '';                                                      // It is use to store style class of current active metric type.
  selectedMetricName = '';                                             // It is use to store Metric name selected in component to display charts.
  parentMetricName = '';                                               // It is use to store name of parent metric whose child is selected.
  metricStatsData = [];                                                // It is use to store data related to stats table exist in Infra and advanced graph section.
  analysisTableData = '';                                              // It is use to store data related to analysis table exist in Infra and advanced graph section.
  apmGraphProperty = [];                                               // It is use to store apmChart property of chart showing in graph section.
  dataNotFound = 'No data found to display';                           // It is use when expected data not found in component.
  

  constructor(private sharedServices: SharedService,
              public store: Store<fromFeature.State>,
              private elRef:ElementRef) { }
  
  ngOnInit(){
    //fetching data from deployment verification state
    this.store.select(fromFeature.selectMetricAnalysisState).subscribe(
      (resdata)=>{
        if(resdata.canaryOutputData !== null){
          this.metricData = resdata['canaryOutputData'];
          this.thresholdScore = {
            maxScore: +this.metricData.canary_output.maximumCanaryScore,
            minScore: +this.metricData.canary_output.minimumCanaryScore
          }
          this.APMMetricData = [];
          this.InfraMetricData = [];
          this.AdvancedMetricData = [];
          this.metricSelectedRow = -1;
          this.apmMetricSelectedType = '';
          this.metricType = '';
          this.statusSearchData = [false,false,false];
          if(this.metricData.canary_output.results !== undefined){
            this.metricData.canary_output.results.forEach((metricData) => {
              switch(metricData.category){
                case 'APM':
                  this.APMMetricData.push(metricData);
                  break;
                case 'Infrastructure':
                  this.InfraMetricData.push(metricData);
                  break;
                case 'ADVANCED':
                  this.AdvancedMetricData.push(metricData);
                  break;
              }
            });
          }

          // populating core data to use in status checkbox filter functionality.
          this.coreAPMData = this.APMMetricData;
          this.coreInfraData = this.InfraMetricData;
          this.coreAdvancedData = this.AdvancedMetricData;

          // creating initial array for Infra metric
          if(this.InfraMetricData.length > 0){
            this.childMetric['Infra'] = [];
            this.InfraMetricData.forEach(infraChildData => {
              this.childMetric['Infra'].push(false);
            })
          }

          // creating initial array for Advanced metric
          if(this.AdvancedMetricData.length > 0){
            this.childMetric['Advanced'] = [];
            this.AdvancedMetricData.forEach(advancedChildData => {
              this.childMetric['Advanced'].push(false);
            })
          }

          // load initial chart in chart section
          if(this.APMMetricData.length>0){
            if(this.metricSelectedRow === -1 && this.apmMetricSelectedType === ''){
              this.onClickAPMRow(0,null,'Latency',this.APMMetricData[0].name);
            }
          }else if(this.InfraMetricData.length>0){
            this.childMetric['Infra'][0] = true;
            this.childView_rowanimation = 'expanded';
            setTimeout(() => {
              this.elRef.nativeElement.querySelector('#Infra0').style.transform = 'rotate(90deg)';
            },500);
            const initialData = {
              type:'Infrastructure',
              selectedMetricName:this.InfraMetricData[0].metricList[0].metricName,
              index:0,
              parent:this.InfraMetricData[0].name
            }
            this.recivedChildData(initialData);
          }else if(this.AdvancedMetricData.length > 0){
            this.childMetric['Advanced'][0] = true;
            this.childView_rowanimation = 'expanded';
            setTimeout(() => {
              this.elRef.nativeElement.querySelector('#Advanced0').style.transform = 'rotate(90deg)';
            },500);
            const initialData = {
              type:'ADVANCED',
              selectedMetricName:this.AdvancedMetricData[0].metricList[0].metricName,
              index:0,
              parent:this.AdvancedMetricData[0].name
            }
            this.recivedChildData(initialData);
          }
        }
      }
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    // dispatching the action to fetch api by passing updated paeams
    if(!this.initialCall){
      if(this.canaryId !== undefined && this.serviceId !==undefined){
        this.store.dispatch(MetricAnalysisActions.loadMetricAnalysis({canaryId:this.canaryId,serviceId:this.serviceId}));
      }
    }else{
      this.initialCall = false;
    }
  }

  // Below function is use to capture events occur in matric analysis component and make responsive to table.
  @HostListener('window:mousemove', ['$event'])
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
            this.selectedTableSticky(false);
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
    const averageScore = typeScore === 0 ? typeScore : typeScore/counter;
    const assignedColor = counter > 0 ? this.assignProperColor(averageScore) : this.assignProperColor(undefined);
    return assignedColor + 'btn';
  }

  // Below function is use to return appropriate color on the basics of matric score calculation
  assignProperColor(score){
    if(score === undefined){
      return 'countDisabled';
    } else if(score<this.thresholdScore.minScore){
      return 'countDanger';
    } else if(score>this.thresholdScore.minScore && score<this.thresholdScore.maxScore){
      return 'countWarning';
    } else if(score>this.thresholdScore.maxScore){
      return 'countSuccess';
    }
  }

  // Below function is execute when user perform search on table using search input.
  onSearch(){
    if(this.searchData === ''){
      // below code is use to show selected row while searching
      this.selectedTableSticky(true);
    }
    
  }
  
  // Below function is use to filter table based on selected checkbox
  onSelectCheckbox(event){
    let filteredAPMData = [];
    let filteredInfraData = [];
    let filteredAdvancedData = [];
    if(event.target.checked){
      this.updateStatusSearchData(event.target.id,true);
    }else{
      this.updateStatusSearchData(event.target.id,false);
    }
    //filtering apm metric data on status search basics
    if(this.coreAPMData.length > 0){
      filteredAPMData = this.coreAPMData.filter(metric => {
        return this.filterMetricData(metric);
      })
    }
    
    // filtering Infra metric data on status search basics
    if(this.coreInfraData.length > 0){
      filteredInfraData = this.coreInfraData.filter(metric => {
        return this.filterMetricData(metric);
      })
    }

    // filtering Advanced metric data on status search basics
    if(this.coreAdvancedData.length > 0){
      filteredAdvancedData = this.coreAdvancedData.filter(metric => {
        return this.filterMetricData(metric);
      })
    }
    
    // checking whether status search is enabled or not
    if(this.statusSearchData.indexOf(true) === -1){
      this.APMMetricData = this.coreAPMData;
      this.InfraMetricData = this.coreInfraData;
      this.AdvancedMetricData = this.coreAdvancedData;
    }else {
      this.APMMetricData = filteredAPMData;
      this.InfraMetricData = filteredInfraData;
      this.AdvancedMetricData = filteredAdvancedData;
    }
    
    this.childMetric['Infra'].forEach((el,index) => {
        this.resetCarret('Infra'+index,el)
    })
    
  }

  // Below function is use to execute when status Checkbox is selected to reset carret present in group level row
  resetCarret(selectorId,rowSelected){
    setTimeout(()=>{
      if(rowSelected){
        if(this.elRef.nativeElement.querySelector('#sticky'+selectorId) !== null){
          this.elRef.nativeElement.querySelector('#sticky'+selectorId).style.transform = 'rotate(90deg)';
        }
        this.elRef.nativeElement.querySelector('#'+selectorId).style.transform = 'rotate(90deg)';
      }else{
        if(this.elRef.nativeElement.querySelector('#sticky'+selectorId) !== null){
          this.elRef.nativeElement.querySelector('#sticky'+selectorId).style.transform = 'rotate(0deg)';
        }
        this.elRef.nativeElement.querySelector('#'+selectorId).style.transform = 'rotate(0deg)';
      }  
    },200)
  } 
  
  // Below function is use to update statusSearchData after click on checkbox
  updateStatusSearchData(id,value){
    if(id === 'indigatorRed'){
      this.statusSearchData[0] = value;
    }else if(id === 'indigatorWarning'){
      this.statusSearchData[1] = value;
    }else{
      this.statusSearchData[2] = value;
    }
  }

  // Below function is use to filtering the data after click on checkbox
  filterMetricData(metric){
    if(this.statusSearchData[0] && metric.groupScore < this.thresholdScore.minScore){
       return metric;
     }else if(this.statusSearchData[1] && metric.groupScore > this.thresholdScore.minScore && metric.groupScore < this.thresholdScore.maxScore){
       return metric;
     }else if(this.statusSearchData[2] && metric.groupScore > this.thresholdScore.maxScore){
       return metric
     }else{
       if(this.statusSearchData.indexOf(true) === -1){
         return metric;
       }
     }
  }

  // Below function is execute when sticky table is visible to make selected row highlited.
  selectedTableSticky(searchEnabled){
    if(this.InfraMetricData.length > 0){
      let selectedRow = this.childMetric['Infra'].indexOf(true);
      if( selectedRow >= 0){
        if(this.elRef.nativeElement.querySelector('#stickyInfra0') !== null){
          this.elRef.nativeElement.querySelector('#stickyInfra'+selectedRow).style.transform = 'rotate(90deg)';
        }
        if(searchEnabled){
          setTimeout(()=>{
            this.elRef.nativeElement.querySelector('#Infra'+selectedRow).style.transform = 'rotate(90deg)';
          },200)
        }
      }
    } else if (this.AdvancedMetricData.length > 0){
      let selectedRow = this.childMetric['Advanced'].indexOf(true);
      if( selectedRow >= 0){
        if(this.elRef.nativeElement.querySelector('#stickyAdvanced0') !== null){
          this.elRef.nativeElement.querySelector('#stickyAdvanced'+selectedRow).style.transform = 'rotate(90deg)';
        }
        if(searchEnabled){
          setTimeout(()=>{
            this.elRef.nativeElement.querySelector('#Advanced'+selectedRow).style.transform = 'rotate(90deg)';
          },200)
        }
      }
    } else {
      return 0;
    }
  }

  // Below function is execute on click of APM metric table row
  onClickAPMRow(rowIndex,event,id,metricNmae){
    this.metricSelectedRow = rowIndex;
    this.selectedMetricName = metricNmae;
    this.metricType = 'APM';
    let chartsData = [];
    this.apmGraphProperty = []; 
    if(event !== null){
      this.apmMetricSelectedType = event.target.id;
      this.typeColor = this.AvgerageScore(rowIndex,event.target.id);
    }else{
      this.apmMetricSelectedType = id;
      this.typeColor = this.AvgerageScore(rowIndex,id);
    }
    this.APMMetricData[rowIndex].metricList.forEach(metricListData => {
      if(this.apmMetricSelectedType === metricListData.label){
        let chartname = metricListData.metricName.split(';');
        this.apmGraphProperty.push(chartname[1]);
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

// Below function is use to see nested child row 
onClickParentRow(index,event,parentId){
  if(this.childMetric[parentId].indexOf(true) === -1){
    this.childMetric[parentId][index] = true;
    this.childView_rowanimation = 'expanded';
    if(this.sticky){
      this.elRef.nativeElement.querySelector('#'+event.target.parentNode.id+index).style.transform = 'rotate(90deg)';
      this.elRef.nativeElement.querySelector('#'+parentId+index).style.transform = 'rotate(90deg)';
    }else {
      this.elRef.nativeElement.querySelector('#'+event.target.parentNode.id+index).style.transform = 'rotate(90deg)';
    }
    
  }else{
    this.childView_rowanimation = 'collapsed';
    const index_val = this.childMetric[parentId].indexOf(true);
    this.childMetric[parentId][index_val] = false;
    if(this.sticky){
      this.elRef.nativeElement.querySelector('#'+event.target.parentNode.id+index_val).style.transform = 'rotate(0deg)';
      this.elRef.nativeElement.querySelector('#'+parentId+index_val).style.transform = 'rotate(0deg)';
    }else{
      this.elRef.nativeElement.querySelector('#'+event.target.parentNode.id+index_val).style.transform = 'rotate(0deg)';
    }
    if(index !== index_val){
      this.onClickParentRow(index,event,parentId);
    }
  }
}

// Below function is execute after click on row exist in child table.
recivedChildData(event){
  this.metricType = event.type;
  this.metricSelectedRow = event.index;
  this.selectedMetricName = event.selectedMetricName;
  this.parentMetricName = event.parent;
  this.metricStatsData = [];
  this.analysisTableData = '';
  let chartData = [];
  if(this.metricType === 'Infrastructure'){
    this.InfraMetricData.forEach((metricGroupData,index) => {
      if(metricGroupData.name === this.parentMetricName){
        chartData.push(metricGroupData.metricList[this.metricSelectedRow].scatterData);
        this.analysisTableData = metricGroupData.metricList[this.metricSelectedRow].description;
        this.typeColor = this.assignProperColor(metricGroupData.metricList[this.metricSelectedRow].metricScore);
        for(const stats in metricGroupData.metricList[this.metricSelectedRow].stats){
          if(stats === 'version1'){
            this.createStatsTable('Baseline',metricGroupData.metricList[this.metricSelectedRow].stats[stats]);
          }else{
            this.createStatsTable('New Release',metricGroupData.metricList[this.metricSelectedRow].stats[stats]);
          }
        }
      }
    })
  }else if(this.metricType === 'ADVANCED'){
    this.AdvancedMetricData.forEach((metricGroupData,index) => {
      if(metricGroupData.name === this.parentMetricName){
        chartData.push(metricGroupData.metricList[this.metricSelectedRow].scatterData);
        this.analysisTableData = metricGroupData.metricList[this.metricSelectedRow].description;
        this.typeColor = this.assignProperColor(metricGroupData.metricList[this.metricSelectedRow].metricScore);
        for(const stats in metricGroupData.metricList[this.metricSelectedRow].stats){
          if(stats === 'version1'){
            this.createStatsTable('Baseline',metricGroupData.metricList[this.metricSelectedRow].stats[stats]);
          }else{
            this.createStatsTable('New Release',metricGroupData.metricList[this.metricSelectedRow].stats[stats]);
          }
        }
      }
    })
  }

  this.formLineChartData(chartData);  
}

// Below function is use to to form statsTable data exist in infra and advanced metric graph section.
createStatsTable(versionName,restData){
  let statsObj = {
    'name':versionName,
    '1stQuantile':restData['1stQuantile'],
    '3rdQuantile':restData['3rdQuantile'],
    'Mean':restData['Mean'],
    'Median':restData['Median'],
    'Min':restData['Min'],
    'Max':restData['Max']
  }
  this.metricStatsData.push(statsObj);
}

// Below function is return true if group contain CRITICAL or WATCHLIST in it.
containProperty(childObj,type){
  let propertyexist = false;
  childObj.forEach(childElement => {
    if(childElement[type]){
      propertyexist = true;
    }
  })
  return propertyexist;
}

  // Below function is return interval in form of array after calculating bucket score
  intervalCount(intervalObj){
    let intervalArr = [];
    for(const interval in intervalObj){
      intervalArr.push(intervalObj[interval]);
    }
    return intervalArr;
  }
}
