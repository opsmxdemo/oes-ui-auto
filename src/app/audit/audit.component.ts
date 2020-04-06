import { Component, OnInit } from '@angular/core';
import { AuditService } from '../services/audit.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.less']
})
export class AuditComponent implements OnInit {

  constructor(public auditService: AuditService) { }

  parameters: any;
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

  ngOnInit(): void {
    this.auditService.getAllPipelines(this.parameters).subscribe(
      (response) => {
        this.allPipelines = response;
        this.results = this.allPipelines.results;
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

}

