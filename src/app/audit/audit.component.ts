import { Component, OnInit } from '@angular/core';
import { AuditService } from '../services/audit.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.less']
})
export class AuditComponent implements OnInit {

  constructor(public auditService: AuditService) { }

  parameters:any;
  allPipelines : any = null;//this is use to stroe response in Object format.
  results = [''];           //this contain result array fetched from response.
  page = {                  //this is use to support pagination in audit page.
    startingPoint:0,
    endPoint:20,
    pageSize:20,
    currentPage:1,
    pageNo:1,
  }
  perPageData:number = 20;  //this is use to populate value in perPage dropdown exist in pagination.
  currentPage = [''];       //this use to store array of results exist in current page.
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
  ngOnInit(): void {
    this.isAllPipelines = false;
    this.isSuccessPipelines = false;
    this.isModifiedPipelines = false;
    this.isFailedPipelines = false;
  }

  showAllPipelies() {
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
  }
  
  showSuccessfulPipelines(){
    this.isAllPipelines = false;
    this.isFailedPipelines = false;
    this.isModifiedPipelines = false;
    this.auditService.getSuccessfulPipelines().subscribe(
      (response) => {
        console.log(response);
        this.allSuccessfullPipelines = response;
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
    this.auditService.getAllFailedPipelines().subscribe(
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
    renderPage(){
      this.currentPage = [];
      for(let i=this.page.startingPoint;i<=this.page.endPoint;i++){
        this.currentPage.push(this.results[i]);
      }

      /*this.successcurrentPage = [];
      for(let i=this.successpage.startingPoint;i<=this.successpage.endPoint;i++){
        this.successcurrentPage.push(this.successfulResults[i]);
      }*/
    }

    //Below function is execute on click of page next btn
    pageNext(){
      if(this.page.endPoint < this.results.length){
        this.page.pageNo += 1;
        this.page.currentPage = this.page.pageNo;
        if((this.page.endPoint+this.page.pageSize) < this.results.length){
          this.page.startingPoint += this.page.pageSize;
          this.page.endPoint += this.page.pageSize;
        }else if(this.page.endPoint < this.results.length){
          this.page.startingPoint = this.page.endPoint;
          this.page.endPoint = this.results.length;
        }
        this.renderPage();
      }

      /*if(this.successpage.endPoint < this.successfulResults.length){
        this.successpage.pageNo += 1;
        this.successpage.currentPage = this.successpage.pageNo;
        if((this.successpage.endPoint+this.successpage.pageSize) < this.successfulResults.length){
          this.successpage.startingPoint += this.successpage.pageSize;
          this.successpage.endPoint += this.successpage.pageSize;
        }else if(this.successpage.endPoint < this.successfulResults.length){
          this.successpage.startingPoint = this.successpage.endPoint;
          this.successpage.endPoint = this.successfulResults.length;
        }
        this.renderPage();
      }*/
    }
   
    //Below function is execute on click of page prev btn
    pagePrev(){
      if(this.page.startingPoint !== 0){
        this.page.pageNo -= 1;
        this.page.currentPage = this.page.pageNo;
        if((this.page.startingPoint-this.page.pageSize)>0){
          this.page.startingPoint -= this.page.pageSize;
          this.page.endPoint = this.page.startingPoint+this.page.pageSize;
        }else if((this.page.startingPoint-this.page.pageSize)>=0){
          this.page.startingPoint = 0;
          this.page.endPoint = this.page.pageSize;
        }
        this.renderPage();
      }

      /*if(this.successpage.startingPoint !== 0){
        this.successpage.pageNo -= 1;
        this.successpage.currentPage = this.successpage.pageNo;
        if((this.successpage.startingPoint-this.successpage.pageSize)>0){
          this.successpage.startingPoint -= this.successpage.pageSize;
          this.successpage.endPoint = this.successpage.startingPoint+this.successpage.pageSize;
        }else if((this.successpage.startingPoint-this.successpage.pageSize)>=0){
          this.successpage.startingPoint = 0;
          this.successpage.endPoint = this.successpage.pageSize;
        }
        this.renderPage();
      }*/
    }

    //Below function is execute on change of perPage deopdown value
    onChangePerPageData(){
      this.page.pageSize = +this.perPageData;
      if((this.page.startingPoint+this.page.pageSize) < this.results.length){
        this.page.endPoint = this.page.startingPoint + this.page.pageSize;
      }else{
        this.page.endPoint = this.results.length;
      }
      this.renderPage();
      
      /*this.successpage.pageSize = +this.successperPageData;
      if((this.successpage.startingPoint+this.successpage.pageSize) < this.successfulResults.length){
        this.successpage.endPoint = this.successpage.startingPoint + this.successpage.pageSize;
      }else{
        this.successpage.endPoint = this.successfulResults.length;
      }
      this.renderPage();*/
    }

  //Below function is executes on click of page btn exist in pagination
  showPage(currentPage){
    this.page.pageNo = currentPage;
    this.page.startingPoint =  (currentPage-1)*this.page.pageSize;
    if(currentPage*this.page.pageSize < this.successfulResults.length){
      this.page.endPoint = currentPage*this.page.pageSize;
    }else{
      this.page.endPoint = this.successfulResults.length;
    }
    this.renderPage();
  }

  /*showPageSuccess(successcurrentPage){
    this.successpage.pageNo = successcurrentPage;
    this.successpage.startingPoint =  (successcurrentPage-1)*this.successpage.pageSize;
    if(successcurrentPage*this.successpage.pageSize < this.successfulResults.length){
      this.successpage.endPoint = successcurrentPage*this.successpage.pageSize;
    }else{
      this.successpage.endPoint = this.successfulResults.length;
    }
    this.renderPage();
  }*/

  

}

