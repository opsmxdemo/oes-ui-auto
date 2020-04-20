import { Component, OnInit } from '@angular/core';
import { AuditService } from '../services/audit.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.less']
})
export class AuditComponent implements OnInit {

  constructor(public auditService: AuditService) { }

  authResponse : any = null;
  token: any = null;
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
  groupCountList : any = null;
  isAllPipelines :any;      //this is to show or hide the all pipelines div


  allSuccessfullPipelines : any = null;
  successfulResults = [''];
  successpage = {                  //this is use to support pagination in audit page.
    startingPoint:0,
    endPoint:20,
    pageSize:20,
    currentPage:1,
    pageNo:1,
  }
  successperPageData:number = 20;  //this is use to populate value in perPage dropdown exist in pagination.
  successcurrentPage = ['']; 
  isSuccessPipelines :any;
  keyArray : any;
  valueArray: any;
  editAllObj ={
    "key" : "",
		"displayValue" : null,
		"displayAllowed": false,
		"isCustomAllowed":true
  };
  allSuccessCustomAllowedValues : any = [];
  allSuccessCustomFalseValues : any = [];
  allSuccessDisplayTrueValues :any =[];

  allModifiedPipelines : any = null;
  modifiedResults = [''];
  modifiedpage = {                  //this is use to support pagination in audit page.
    startingPoint:0,
    endPoint:20,
    pageSize:20,
    currentPage:1,
    pageNo:1,
  }
  modifiedperPageData:number = 20;  //this is use to populate value in perPage dropdown exist in pagination.
  modifiedcurrentPage = ['']; 
  isModifiedPipelines :any;

  failedPipelines : any = null;
  failedResults = [''];
  failedpage = {                  //this is use to support pagination in audit page.
    startingPoint:0,
    endPoint:20,
    pageSize:20,
    currentPage:1,
    pageNo:1,
  }
  failedperPageData:number = 20;  //this is use to populate value in perPage dropdown exist in pagination.
  failedcurrentPage = ['']; 
  isFailedPipelines :any;
 
  //list_items : any =[];
  
  ngOnInit(): void {

    //this.list_items = [{name:'abc',code:'123'},{name:'def',code:'456'}];

  // keys = Object.keys(this.list_items[0]);
    this.isAllPipelines = false;
    this.isSuccessPipelines = false;
    this.isModifiedPipelines = false;
    this.isFailedPipelines = false;
    this.auditService.autheticate().subscribe(
      (response) => {
        this.authResponse = response;
        this.token = this.authResponse.authToken;
        this.auditService.getAllPipelines(this.token).subscribe(
          (response) => {
            this.allPipelines = response;
            //this.results = this.allPipelines.results;
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

  /*showAllPipelies() {
    this.isSuccessPipelines = false;
    this.isFailedPipelines = false;
    this.isModifiedPipelines = false;
    this.auditService.getAllPipelines(this.parameters).subscribe(
      (response) => {
        this.allPipelines = response;
        this.results = this.allPipelines.results.splice(1,this.allPipelines.results.length);;
        this.isAllPipelines = true;
        this.results.forEach((element,index) => {
          if(this.page.endPoint >= index){
            this.currentPage.push(element);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }*/
  
  
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
            this.allSuccessCustomAllowedValues.push(this.editAllObj);
          }else if(this.editAllObj.displayAllowed && !this.editAllObj.isCustomAllowed){ 
            this.allSuccessCustomFalseValues.push(this.editAllObj);
          }
          
        });
        this.allSuccessCustomFalseValues.forEach(val => this.allSuccessDisplayTrueValues.push(Object.assign({}, val)));
        this.allSuccessCustomAllowedValues.forEach(val => this.allSuccessDisplayTrueValues.push(Object.assign({}, val)));
        this.successfulResults = this.allSuccessfullPipelines.results.splice(1,this.allSuccessfullPipelines.results.length);;
        this.isSuccessPipelines = true;
        this.successfulResults.forEach((element,index) => {
          if(this.successpage.endPoint >= index){
            this.successcurrentPage.push(element);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  onSuccessPipelineChange(item){
    let indextoDelete = this.allSuccessDisplayTrueValues.findIndex(x => x.key==item.key);
    if(indextoDelete > -1){
      this.allSuccessDisplayTrueValues.splice(indextoDelete,1);
    }    
  }

  showModifiedPipelines(){
    this.isAllPipelines = false;
    this.isSuccessPipelines = false;
    this.isFailedPipelines = false;
    this.auditService.getAllModifiedPipelines().subscribe(
      (response) => {
        console.log(response);
        this.allModifiedPipelines = response;
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


 
  showFailedPipelines(){
    this.isAllPipelines = false;
    this.isSuccessPipelines = false;
    this.isModifiedPipelines = false;
    this.auditService.getauditapplications().subscribe(
      (response) => {
        console.log(response);
        this.failedPipelines = response;        
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

  //Below function is execute on change of perPage dropdown value
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

}


