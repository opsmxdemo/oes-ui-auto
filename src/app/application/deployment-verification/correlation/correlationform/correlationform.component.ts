import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CorrelationformdetailsComponent } from './correlationformdetails/correlationformdetails.component';



@Component({
  selector: 'app-correlationform',
  templateUrl: './correlationform.component.html',
  styleUrls: ['./correlationform.component.less']
})
export class CorrelationformComponent implements OnInit {

  @Input() data:any;                                                  //right side data for popup sending directly to correlationformdetails
  @Input() serviceInfo:any;
  @Output() onSubmitPostData = new EventEmitter<boolean>();
  @Output() onSelectedServiceChange = new EventEmitter<boolean>();                 // 
  @ViewChild(CorrelationformdetailsComponent, {static: false}) child1: CorrelationformdetailsComponent; //sending the event information to child component when new service is clicked
  serviceClusters:any=[] 
  selectedServiceClusterData:any;
  submitjsondata:any;                                                 // for storing objects with data of checked item of every service
  selectedService:any                                                          // selected service at any time
  constructor() { }

  ngOnInit(): void {

    //creating json structure for final json to be submitted
    this.submitjsondata={
      riskAnalysisId:"",
      serviceClusters:[]
    }
    //console.log(this.serviceInfo)
     for(let i=0;i<this.serviceInfo.length;i++)
     {
       let myobj={
        serviceId:this.serviceInfo[i].serviceId,
        data:[]
       }
       this.serviceClusters.push(myobj)
     }
     //console.log(this.serviceClusters)
     this.selectedService = this.serviceInfo[0].serviceId
  }

  // when another service is slected
  selectService(selectedServiceInfo){
    this.selectedService=selectedServiceInfo.serviceId;
    this.onSelectedServiceChange.emit(this.selectedService);
    let counter=0;
    
    for(let i=0;i<this.serviceClusters.length;i++)
    {
      if(this.serviceClusters[i].serviceId==this.selectedService && this.serviceClusters[i].data['Critical'] != undefined)
      {
        this.selectedServiceClusterData=this.serviceClusters[i].data
        counter++;
      }
    }
    if(counter==0){
      this.selectedServiceClusterData=undefined
    }
    
  }

  // getting updated data on everycheckbox clicked
  getData(value){ 
    if(value)
    {
      this.updateJson(value);
    }
    
  }

  //update serviceClusters array
  updateJson(value){
    for(let i=0;i<this.serviceClusters.length;i++)
    {
      if(this.serviceClusters[i].serviceId == this.selectedService)
      {
        this.serviceClusters[i].data = value
      }
    }
  
   // const result = this.serviceClusters.find( ({ serviceId }) => serviceId == this.selectedService );
      //console.log(result)
  }

  onSubmit(){
    var activeKeys=[]
    for(let i=0;i<this.serviceClusters.length;i++)
    {
      if(Object.keys(this.serviceClusters[i].data).length > 0 )
      {
       var CriticalActivekeys = Object.keys(this.serviceClusters[i].data.Critical).filter(k => this.serviceClusters[i].data.Critical[k])
       var ERRORActivekeys = Object.keys(this.serviceClusters[i].data.ERROR).filter(k => this.serviceClusters[i].data.ERROR[k])
       var WarnActivekeys = Object.keys(this.serviceClusters[i].data.Warn).filter(k => this.serviceClusters[i].data.Warn[k])
       activeKeys = CriticalActivekeys.concat(ERRORActivekeys).concat(WarnActivekeys);
        let myobj = {
          serviceId:this.serviceClusters[i].serviceId,
          clusterIds:activeKeys
        }
        this.submitjsondata.serviceClusters.push(myobj)
      }
      
    }
    this.onSubmitPostData.emit(this.submitjsondata);
  }
  

  

}
