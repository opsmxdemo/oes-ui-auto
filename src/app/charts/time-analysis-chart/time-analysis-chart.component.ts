import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { empty } from 'rxjs';

@Component({
  selector: 'app-time-analysis-chart',
  templateUrl: './time-analysis-chart.component.html',
  styleUrls: ['./time-analysis-chart.component.less']
})
export class TimeAnalysisChartComponent implements OnInit {
  @Output() openpopUp = new EventEmitter();
  @Output() getClickedTimeStamp = new EventEmitter<boolean>(); 
  @Output() getserviceId = new EventEmitter<boolean>();
  @Output() getClusterId = new EventEmitter();
  @Input() config:any;
  @Input() clusterId:any;
  @Input() dataSource: any;
  @Input() startTime: any;
  @Input() endTime: any;
  @Input() serviceId: any;
  @Input() allUnexpectedEventSummary:any;
  @Input() serviceName:any;
  @Input() topic:any;
  @Input() description:any;


  startTimeInHoursMins:any;                                               //storing only starting time hours and min 
  endTimeInHoursMins:any;                                                 //storing only end time hours and min
  dataSourceInHourMins=[];                                                //storing timestamp hours and min
  counts = [];                                                            //array of object for counting repetetions and time stamp 
  chartData=[];                                                          //storing formated chart data to use for rendering chart
  xaxisArray: any; 
  finalDataSource                                                       //storing all the x axis value
  ChartShow:any=true;
  chart:any;
  selectedClusterHeading:any;
  selectedClustertopic:any;

  constructor() { }

  ngOnInit(): void {
    
   
    
    
    //
    this.startTimeInHoursMins = this.changeTimeinHourMins(this.startTime)       
    this.endTimeInHoursMins = this.changeTimeinHourMins(this.endTime)

    for(let i=0;i<this.dataSource.length;i++)
    {
      this.dataSourceInHourMins.push({"hourminTime":this.changeTimeinHourMinsFromString(this.dataSource[i].time),"dataSourceTime":this.dataSource[i].time,"count":this.dataSource[i].count})
    }

    // //for making object with time stamp and its repetition count
    // [...new Set(this.dataSourceInHourMins)].forEach(item => this.counts.push({
    //   key: item.hourminTime,
    //   tooltextTime:item.dataSourceTime,
    //   // Get the count of items of the current type
    //   count: this.dataSourceInHourMins.filter(i => i.hourminTime == item.hourminTime).length
    // }));

    // this.xaxisArray = this.generateTimeIntervalsForChartData(new Date(this.startTime).getHours(),new Date(this.startTime).getMinutes(),new Date(this.endTime).getHours(),new Date(this.endTime).getMinutes())
    
    // // for creating final data for rendering in chart
    
      for(let i =0;i<this.dataSourceInHourMins.length;i++)
      {
        var countRep:any;
        if(this.dataSourceInHourMins[i].count==0)
        {
          countRep=null;
        }
        else{
          countRep=this.dataSourceInHourMins[i].count
        }

        var myobj={
          label:this.dataSourceInHourMins[i].hourminTime,
          value:countRep,
          tooltext:new Date(this.dataSourceInHourMins[i].dataSourceTime).toLocaleString()+'<br><br>'+"Repetition: &nbsp;"+countRep,
          epochTime:this.dataSourceInHourMins[i].dataSourceTime
          
        }
        this.chartData.push(myobj)
       
        
      }
      
    
    
    // creating chart
    this.finalDataSource = {
      chart: {
        "numDivlines": "2",
        xaxisname: "Time",
        yaxisname: "Repetition",
        theme: "fusion",
        labelFontSize:"9"
      },
      data:this.chartData
      }
      
  }

  // function for changing time in hour min format
  changeTimeinHourMins(time:any){
    
    if(new Date(time).getMinutes()>9)
    {
    let timeInHourMins = new Date(time).getHours()+":"+new Date(time).getMinutes();//8:00//8:00,8:01
    return timeInHourMins;
    }
    else{
      let timeInHourMins = new Date(time).getHours()+":0"+new Date(time).getMinutes();
    return timeInHourMins;
    }
    
  }

  changeTimeinHourMinsFromString(time:any){
    time=time+""+"Z"
    if(new Date(time).getMinutes()>9)
    {
    let timeInHourMins = new Date(time).getHours()+":"+new Date(time).getMinutes();//8:00//8:00,8:01
    return timeInHourMins;
    }
    else{
      let timeInHourMins = new Date(time).getHours()+":0"+new Date(time).getMinutes();
    return timeInHourMins;
    }
    
  }

  // function for getting all x axis value
  generateTimeIntervalsForChartData(startTimeHour,startTimemin,endTImeHour,endTImeMin){
    var x = 1; //minutes interval
    var times = []; // time array
    var startTime = startTimeHour*60+startTimemin; // start time
    var endTime = endTImeHour*60+endTImeMin; // start time
    var count=0
    
    if(startTime>endTime)
    {
      endTime = endTime+1440;
    }
    for (var i=startTime;i<endTime+1; i++) {
      var hh = Math.floor(i/60); // getting hours of day in 0-24 format
      var mm = (i%60); // getting minutes of the hour in 0-55 format
      if(hh>23)
      {
        hh=hh-24;
      }
      times[count] = ("0" + (hh)).slice(-2) + ':' + ("0" + mm).slice(-2) ; 
      count++;
    }
    return times
  }

  
  plotRollOver($event) {
    var ClickedTimeStamp = $event.eventObj.sender.args.dataSource.data[$event.eventObj.data.dataIndex].epochTime
    this.getClickedTimeStamp.emit(ClickedTimeStamp);
    this.openpopUp.emit({"clusterId":this.clusterId,"serviceId":this.serviceId,"ClickedTimeStamp":ClickedTimeStamp});
    this.getserviceId.emit(this.serviceId);
  }

  closeTimeAnalysis(){
    this.getClusterId.emit({"clusterId":this.clusterId,"serviceId":this.serviceId,"topics":this.topic});
    this.ChartShow=false;
  }
  initialized($event) {
    this.chart = $event.chart; // Storing the chart instance
  }


  

  

}
