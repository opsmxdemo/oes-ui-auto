import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuditService } from '../services/audit.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.less']
})
export class AuditComponent implements OnInit {

  @ViewChild('datedropdownbtn') datedropdownbtn: ElementRef;

  constructor(public auditService: AuditService) { }

  allPipelines: any = null; //this is use to stroe response in Object format.
  results = [''];           //this contain result array fetched from response.
  page = {                  //this is use to support pagination in audit page.
    startingPoint: 0,
    endPoint: 20,
    pageSize: 20,
    currentPage: 1,
    pageNo: 1,
  }
  perPageData: number = 20; //this is use to populate value in perPage dropdown exist in pagination.
  currentPage = [''];       //this use to store array of results exist in current page.
  searchData: any = null;   // this is use to fetch value from search field.
  groupCountList: any = null;
  isAllPipelines: any;      //this is to show or hide the all pipelines div
  allPipelineCustomAllowedValues :any = [];
  allPipelineCustomFalseValues : any= [];
  allPipelineDisplayTrueValues : any= [];

  allSuccessfullPipelines: any = null;
  successfulResults = [''];
  successpage = {                  //this is use to support pagination in audit page.
    startingPoint: 0,
    endPoint: 20,
    pageSize: 20,
    currentPage: 1,
    pageNo: 1,
  }
  successperPageData: number = 20;  //this is use to populate value in perPage dropdown exist in pagination.
  successcurrentPage = [''];
  isSuccessPipelines: any;
  keyArray: any;
  valueArray: any;
  editAllObj = {
    "key": "",
    "displayValue": null,
    "displayAllowed": false,
    "isCustomAllowed": true
  };
  allSuccessCustomAllowedValues: any = [];
  allSuccessCustomFalseValues: any = [];
  allSuccessDisplayTrueValues: any = [];

  allModifiedPipelines: any = null;
  modifiedResults = [''];
  modifiedpage = {                  //this is use to support pagination in audit page.
    startingPoint: 0,
    endPoint: 20,
    pageSize: 20,
    currentPage: 1,
    pageNo: 1,
  }
  modifiedperPageData: number = 20;  //this is use to populate value in perPage dropdown exist in pagination.
  modifiedcurrentPage = [''];
  isModifiedPipelines: any;
  allModifiedCustomAllowedValues :any = [];
  allModifiedCustomFalseValues :any = [];
  allModifiedDisplayTrueValues :any = [];

  failedPipelines: any = null;
  failedResults = [''];
  failedpage = {                  //this is use to support pagination in audit page.
    startingPoint: 0,
    endPoint: 20,
    pageSize: 20,
    currentPage: 1,
    pageNo: 1,
  }
  failedperPageData:number = 20;  //this is use to populate value in perPage dropdown exist in pagination.
  failedcurrentPage = ['']; 
  isFailedPipelines :any;
  allFailedCustomAllowedValues : any = [];
  allFailedCustomFalseValues : any = [];
  allFailedDisplayTrueValues : any = [];
  dateDropdownOpen = true;
 
  
  
  ngOnInit(): void {

    this.isAllPipelines = false;
    this.isSuccessPipelines = false;
    this.isModifiedPipelines = false;
    this.isFailedPipelines = false;

    this.auditService.getAllPipelines().subscribe(
      (response) => {
        this.allPipelines = response;
        this.allPipelineCustomAllowedValues = [];
        this.allPipelineCustomFalseValues = [];
        this.allPipelineDisplayTrueValues = [];
        Object.entries(this.allPipelines.results[0]).forEach(entry => {
          let key = entry[0];
          let value = entry[1];
          this.editAllObj.displayAllowed = true;
          this.editAllObj.isCustomAllowed = true;
          switch(key){
            case 'buildArtifacts' : this.editAllObj.displayAllowed = false;
            case 'pipelineConfigId': this.editAllObj.displayAllowed = false;
            case 'serverGroups': this.editAllObj.displayAllowed = false; 
            case 'image': this.editAllObj.displayAllowed = false;
            case 'eventId': this.editAllObj.displayAllowed = false; 
            case 'pipelineTreeView':this.editAllObj.displayAllowed = false;
            case 'applicationName' :this.editAllObj.isCustomAllowed = false;
            case 'pipelineName' :this.editAllObj.isCustomAllowed = false;
            case 'user' :this.editAllObj.isCustomAllowed = false;
            case 'pipelineStatus' :this.editAllObj.isCustomAllowed = false;
          }          
          this.editAllObj = {
            "key" : key,
            "displayValue" : value,
            "displayAllowed": this.editAllObj.displayAllowed,
            "isCustomAllowed":this.editAllObj.isCustomAllowed
          };
          if(this.editAllObj.displayAllowed && this.editAllObj.isCustomAllowed){
            this.allPipelineCustomAllowedValues.push(this.editAllObj);
          }else if(this.editAllObj.displayAllowed && !this.editAllObj.isCustomAllowed){ 
            this.allPipelineCustomFalseValues.push(this.editAllObj);
          }
          
        });
        this.allPipelineCustomFalseValues.forEach(val => this.allPipelineDisplayTrueValues.push(Object.assign({}, val)));
        this.allPipelineCustomAllowedValues.forEach(val => this.allPipelineDisplayTrueValues.push(Object.assign({}, val)));
        this.results = this.allPipelines.results.splice(1,this.allPipelines.results.length);
        this.isAllPipelines = true;
        this.results.forEach((element, index) => {
          if (this.page.endPoint >= index) {
            this.currentPage.push(element);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    )   
    this.auditService.getPipelineGroupCounts().subscribe(
      (response) => {
        this.groupCountList = response;
      },
      (error) => {
        console.log(error);
      }
    )   

  }  
  onAllPipelineChange(item){
    let indextoDelete = this.allPipelineDisplayTrueValues.findIndex(x => x.key==item.key);
    if(indextoDelete > -1){
      this.allPipelineDisplayTrueValues.splice(indextoDelete,1);
    }    
  }

  showSuccessfulPipelines(){
    this.isAllPipelines = false;
    this.isFailedPipelines = false;
    this.isModifiedPipelines = false;
    //this.allSuccessCustomAllowedValues =[];
    this.auditService.getSuccessfulPipelines().subscribe(
      (response) => {
        console.log(response);
        this.allSuccessfullPipelines = response;
        this.allSuccessCustomAllowedValues = [];
        this.allSuccessCustomFalseValues = [];
        this.allSuccessDisplayTrueValues = [];
        Object.entries(this.allSuccessfullPipelines.results[0]).forEach(entry => {
          let key = entry[0];
          let value = entry[1];
          this.editAllObj.displayAllowed = true;
          this.editAllObj.isCustomAllowed = true;
          switch (key) {
            case 'buildArtifacts': this.editAllObj.displayAllowed = false;
            case 'pipelineConfigId': this.editAllObj.displayAllowed = false;
            case 'serverGroups': this.editAllObj.displayAllowed = false;
            case 'image': this.editAllObj.displayAllowed = false;
            case 'eventId': this.editAllObj.displayAllowed = false;
            case 'pipelineTreeView': this.editAllObj.displayAllowed = false;
            case 'applicationName': this.editAllObj.isCustomAllowed = false;
            case 'pipelineName': this.editAllObj.isCustomAllowed = false;
            case 'user': this.editAllObj.isCustomAllowed = false;
            case 'pipelineStatus': this.editAllObj.isCustomAllowed = false;
          }
          this.editAllObj = {
            "key": key,
            "displayValue": value,
            "displayAllowed": this.editAllObj.displayAllowed,
            "isCustomAllowed": this.editAllObj.isCustomAllowed
          };
          if (this.editAllObj.displayAllowed && this.editAllObj.isCustomAllowed) {
            this.allSuccessCustomAllowedValues.push(this.editAllObj);
          } else if (this.editAllObj.displayAllowed && !this.editAllObj.isCustomAllowed) {
            this.allSuccessCustomFalseValues.push(this.editAllObj);
          }

        });
        this.allSuccessCustomFalseValues.forEach(val => this.allSuccessDisplayTrueValues.push(Object.assign({}, val)));
        this.allSuccessCustomAllowedValues.forEach(val => this.allSuccessDisplayTrueValues.push(Object.assign({}, val)));
        this.successfulResults = this.allSuccessfullPipelines.results.splice(1, this.allSuccessfullPipelines.results.length);;
        this.isSuccessPipelines = true;
        this.successfulResults.forEach((element, index) => {
          if (this.successpage.endPoint >= index) {
            this.successcurrentPage.push(element);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  onSuccessPipelineChange(item) {
    let indextoDelete = this.allSuccessDisplayTrueValues.findIndex(x => x.key == item.key);
    if (indextoDelete > -1) {
      this.allSuccessDisplayTrueValues.splice(indextoDelete, 1);
    }
  }

  showModifiedPipelines() {
    this.isAllPipelines = false;
    this.isSuccessPipelines = false;
    this.isFailedPipelines = false;
    this.auditService.getAllModifiedPipelines().subscribe(
      (response) => {
                this.allModifiedPipelines = response;        
        this.allModifiedCustomAllowedValues = [];
        this.allModifiedCustomFalseValues = [];
        this.allModifiedDisplayTrueValues = [];
        Object.entries(this.allModifiedPipelines.results[0]).forEach(entry => {
          let key = entry[0];
          let value = entry[1];
          this.editAllObj.displayAllowed = true;
          this.editAllObj.isCustomAllowed = true;
			    switch(key){            
            case 'pipelineConfigId': this.editAllObj.displayAllowed = false;             
            case 'pipelineTreeView':this.editAllObj.displayAllowed = false;
            case 'applicationName' :this.editAllObj.isCustomAllowed = false;
            case 'pipelineName' :this.editAllObj.isCustomAllowed = false;
            case 'user' :this.editAllObj.isCustomAllowed = false;
            case 'updateTimestamp' :this.editAllObj.isCustomAllowed = false;
          }          
			    this.editAllObj = {
					  "key" : key,
					  "displayValue" : value,
					  "displayAllowed": this.editAllObj.displayAllowed,
					  "isCustomAllowed":this.editAllObj.isCustomAllowed
          };
          if(this.editAllObj.displayAllowed && this.editAllObj.isCustomAllowed){
            this.allModifiedCustomAllowedValues.push(this.editAllObj);
          }else if(this.editAllObj.displayAllowed && !this.editAllObj.isCustomAllowed){ 
            this.allModifiedCustomFalseValues.push(this.editAllObj);
          }
          
        });
        this.allModifiedCustomFalseValues.forEach(val => this.allModifiedDisplayTrueValues.push(Object.assign({}, val)));
        this.allModifiedCustomAllowedValues.forEach(val => this.allModifiedDisplayTrueValues.push(Object.assign({}, val)));
        this.modifiedResults = this.allModifiedPipelines.results.splice(1,this.allModifiedPipelines.results.length);;
        this.isModifiedPipelines = true;
        this.modifiedResults.forEach((element,index) => {
          if(this.modifiedpage.endPoint >= index){
            this.modifiedcurrentPage.push(element);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  onModifiedPipelineChange(item){
    let indextoDelete = this.allModifiedDisplayTrueValues.findIndex(x => x.key==item.key);
    if(indextoDelete > -1){
      this.allModifiedDisplayTrueValues.splice(indextoDelete,1);
    }    
  }
 

  showFailedPipelines() {
    this.isAllPipelines = false;
    this.isSuccessPipelines = false;
    this.isModifiedPipelines = false;
    this.auditService.getAllFailedPipelines().subscribe(
      (response) => {
        this.failedPipelines = response; 
        this.allFailedCustomAllowedValues = [];
        this.allFailedCustomFalseValues = [];
        this.allFailedDisplayTrueValues = [];
        Object.entries(this.failedPipelines.results[0]).forEach(entry => {
          let key = entry[0];
          let value = entry[1];
          this.editAllObj.displayAllowed = true;
          this.editAllObj.isCustomAllowed = true;
			    switch(key){
            case 'buildArtifacts' : this.editAllObj.displayAllowed = false;
            case 'pipelineConfigId': this.editAllObj.displayAllowed = false;
            case 'serverGroups': this.editAllObj.displayAllowed = false; 
            case 'image': this.editAllObj.displayAllowed = false;
            case 'eventId': this.editAllObj.displayAllowed = false; 
            case 'pipelineTreeView':this.editAllObj.displayAllowed = false;
            case 'buildNumber':this.editAllObj.displayAllowed = false;
            case 'buildNumber':this.editAllObj.displayAllowed = false;
            case 'applicationName' :this.editAllObj.isCustomAllowed = false;
            case 'pipelineName' :this.editAllObj.isCustomAllowed = false;
            case 'user' :this.editAllObj.isCustomAllowed = false;
            case 'pipelineStatus' :this.editAllObj.isCustomAllowed = false;
          }          
			    this.editAllObj = {
					  "key" : key,
					  "displayValue" : value,
					  "displayAllowed": this.editAllObj.displayAllowed,
					  "isCustomAllowed":this.editAllObj.isCustomAllowed
          };
          if(this.editAllObj.displayAllowed && this.editAllObj.isCustomAllowed){
            this.allFailedCustomAllowedValues.push(this.editAllObj);
          }else if(this.editAllObj.displayAllowed && !this.editAllObj.isCustomAllowed){ 
            this.allFailedCustomFalseValues.push(this.editAllObj);
          }
          
        });
        this.allFailedCustomFalseValues.forEach(val => this.allFailedDisplayTrueValues.push(Object.assign({}, val)));
        this.allFailedCustomAllowedValues.forEach(val => this.allFailedDisplayTrueValues.push(Object.assign({}, val)));
        this.failedResults = this.failedPipelines.results.splice(1,this.failedPipelines.results.length);;
        this.isFailedPipelines = true;
        this.failedResults.forEach((element,index) => {
          if(this.failedpage.endPoint >= index){
            this.failedcurrentPage.push(element);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  onFailedPipelineChange(item){
    let indextoDelete = this.allFailedDisplayTrueValues.findIndex(x => x.key==item.key);
    if(indextoDelete > -1){
      this.allFailedDisplayTrueValues.splice(indextoDelete,1);
    }    
  }
  //Below function is used to implement pagination
  renderPage() {
    this.currentPage = [];
    for (let i = this.page.startingPoint; i <= this.page.endPoint; i++) {
      this.currentPage.push(this.results[i]);
    }
  }

  //Below function is execute on click of page next btn
  pageNext() {
    if (this.page.endPoint < this.results.length) {
      this.page.pageNo += 1;
      this.page.currentPage = this.page.pageNo;
      if ((this.page.endPoint + this.page.pageSize) < this.results.length) {
        this.page.startingPoint += this.page.pageSize;
        this.page.endPoint += this.page.pageSize;
      } else if (this.page.endPoint < this.results.length) {
        this.page.startingPoint = this.page.endPoint;
        this.page.endPoint = this.results.length;
      }
      this.renderPage();
    }
  }

  //Below function is execute on click of page prev btn
  pagePrev() {
    if (this.page.startingPoint !== 0) {
      this.page.pageNo -= 1;
      this.page.currentPage = this.page.pageNo;
      if ((this.page.startingPoint - this.page.pageSize) > 0) {
        this.page.startingPoint -= this.page.pageSize;
        this.page.endPoint = this.page.startingPoint + this.page.pageSize;
      } else if ((this.page.startingPoint - this.page.pageSize) >= 0) {
        this.page.startingPoint = 0;
        this.page.endPoint = this.page.pageSize;
      }
      this.renderPage();
    }
  }

  //Below function is execute on change of perPage deopdown value
  onChangePerPageData() {
    this.page.pageSize = +this.perPageData;
    if ((this.page.startingPoint + this.page.pageSize) < this.results.length) {
      this.page.endPoint = this.page.startingPoint + this.page.pageSize;
    } else {
      this.page.endPoint = this.results.length;
    }
    this.renderPage();
  }

  //Below function is executes on click of page btn exist in pagination
  showPage(currentPage) {
    this.page.pageNo = currentPage;
    this.page.startingPoint = (currentPage - 1) * this.page.pageSize;
    if (currentPage * this.page.pageSize < this.results.length) {
      this.page.endPoint = currentPage * this.page.pageSize;
    } else {
      this.page.endPoint = this.results.length;
    }
    this.renderPage();
  }

  // Below function is use to hide datedropdown popup on click f apply.
  dateDropdown(event) {
    if(event.target.id === 'applybtn'){
      this.datedropdownbtn.nativeElement.dispatchEvent(new Event('click'));
    }
  }

  // Below function is use to collect all value of datedropdown
  dateForm(value:any){
    const todayDate = new Date();
    let firstDay:Date = null;
    let lastday:Date = null;
    switch (value.customRadio) {
      case 'allTime': 
        return todayDate;
      case 'lastMonth':
        firstDay = new Date(todayDate.getFullYear(), todayDate.getMonth()-1, 1);
        lastday = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        alert(firstDay+"==="+lastday);
        break;
      case 'lastWeek':
        firstDay = new Date((todayDate.setDate(todayDate.getDate() - todayDate.getDay()-6)));
        lastday = new Date(todayDate.setDate(todayDate.getDate() - todayDate.getDay()+7));
        alert(firstDay+"==="+lastday);
        break;
      case 'last24Hour':
        firstDay = new Date(todayDate.setHours(todayDate.getHours() - 24));
        lastday = new Date();
        alert(firstDay+"==="+lastday);
        break;
      case 'custom': 
        return "yet to implement"
    }
    // let val = new Date(1584626198001);
    // console.log("firstday", firstDay);
    // console.log("lastday", lastday);
    // val.setDate(val.getDate() - 2);
    // console.log("date1", val);
    // this.allSuccessfullPipelines.results.forEach((el, index) => {
    //   if (new Date(+el.createdTime) >= val) {
    //     console.log("true", index);
    //   } else {
    //     console.log("false", index);
    //   }
    // })
  }
}



