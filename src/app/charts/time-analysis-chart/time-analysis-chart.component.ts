import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { empty } from 'rxjs';

@Component({
  selector: 'app-time-analysis-chart',
  templateUrl: './time-analysis-chart.component.html',
  styleUrls: ['./time-analysis-chart.component.less']
})
export class TimeAnalysisChartComponent implements OnInit {
  @Output() openpopUp = new EventEmitter<boolean>();
  @Input() config:any;
  @Input() dataSource: any;
  @Input() startTime: any;
  @Input() endTime: any;

  startTimeInHoursMins:any;                                               //storing only starting time hours and min 
  endTimeInHoursMins:any;                                                 //storing only end time hours and min
  dataSourceInHourMins=[];                                                //storing timestamp hours and min
  counts = [];                                                            //array of object for counting repetetions and time stamp 
  chartData=[];                                                          //storing formated chart data to use for rendering chart
  xaxisArray: any; 
  finalDataSource                                                       //storing all the x axis value
  ChartShow:any=true;
  chart:any;

  constructor() { }

  ngOnInit(): void {
    this.startTimeInHoursMins = this.changeTimeinHourMins(this.startTime)       
    this.endTimeInHoursMins = this.changeTimeinHourMins(this.endTime)

    for(let i=0;i<this.dataSource.length;i++)
    {
      this.dataSourceInHourMins.push({"hourminTime":this.changeTimeinHourMins(this.dataSource[i]),"dataSourceTime":this.dataSource[i]})
    }

    //for making object with time stamp and its repetition count
    [...new Set(this.dataSourceInHourMins)].forEach(item => this.counts.push({
      key: item.hourminTime,
      tooltextTime:item.dataSourceTime,
      // Get the count of items of the current type
      count: this.dataSourceInHourMins.filter(i => i.hourminTime == item.hourminTime).length
    }));

    this.xaxisArray = this.generateTimeIntervalsForChartData(new Date(this.startTime).getHours(),new Date(this.startTime).getMinutes(),new Date(this.endTime).getHours(),new Date(this.endTime).getMinutes())
    
    // for creating final data for rendering in chart
    for(let i=0;i<this.xaxisArray.length;i++)
    {
      for(let j =0;j<this.counts.length;j++)
      {
        var count:any;
        var dateTime:any;
        if(this.xaxisArray[i]==this.counts[j].key){
          count=this.counts[j].count
          dateTime = this.counts[j].tooltextTime
          break;
        }
        else{
          count=0
          dateTime=""
       }
        
      }
      var myobj={
        label:this.xaxisArray[i],
        value:count,
        tooltext:new Date(dateTime).toLocaleString()+'<br><br>'+"Repetition: &nbsp;"+count
      }
      this.chartData.push(myobj)
    }

    // creating chart
    this.finalDataSource = {
      chart: {
        "numDivlines": "2",
        xaxisname: "Time",
        yaxisname: "Repetition",
        theme: "fusion"
      },
      data:this.chartData
      }
      
  }

  // function for changing time in hour min format
  changeTimeinHourMins(time:any){
    let timeInHourMins = new Date(time).getHours()+":"+new Date(time).getMinutes();
    return timeInHourMins;
  }

  // function for getting all x axis value
  generateTimeIntervalsForChartData(startTimeHour,startTimemin,endTImeHour,endTImeMin){
    var x = 1; //minutes interval
    var times = []; // time array
    var startTime = startTimeHour*60+startTimemin; // start time
    var endTime = endTImeHour*60+endTImeMin; // start time
    var count=0

    for (var i=startTime;i<endTime+1; i++) {
      var hh = Math.floor(i/60); // getting hours of day in 0-24 format
      var mm = (i%60); // getting minutes of the hour in 0-55 format
      
      times[count] = ("0" + (hh)).slice(-2) + ':' + ("0" + mm).slice(-2) ; 
      count++;
    }
    return times
  }

  
  plotRollOver($event) {
    this.openpopUp.emit(true);
  }

  closeTimeAnalysis(){
    this.ChartShow=false;
  }
  initialized($event) {
    this.chart = $event.chart; // Storing the chart instance
  }


  

  

}
