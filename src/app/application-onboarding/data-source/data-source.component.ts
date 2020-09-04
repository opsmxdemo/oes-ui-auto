import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as fromFeature from '../store/feature.reducer';
import * as DataSourceActions from '../data-source/store/data-source.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';

//import { } from '@ng-bo'

@Component({
  selector: 'app-data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.less']
})
export class DataSourceComponent implements OnInit {

  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  datasourceListData: any;                                                             // It use to store Accountlist data fetched from state.
  searchData: string = '';                                                             // this is use to fetch value from search field.
  perPageData: number = 10;                                                            // this is use to populate value in perPage dropdown exist in pagination.
  page = {                                                                             // this is use to support pagination in accunt page.
    startingPoint: 0,
    endPoint: 10,
    pageSize: 10,
    currentPage: 1,
    pageNo: 1,
  }
  currentPage = [];                                                                    // this use to store array of data exists in current page.
  datasourceListLength: number = null;                                                 // It is use to store length of datasource list.
  tableIsEmpty: boolean = false;                                                       // It is use to show or hide the empty table page.
  accountBelongsTo: string = null;                                                     // It is use to store value of account belongs to i.e, AP or OES.
  supportedDatasources = null;                                                         // It is use to store all supported datasource available datasource.
  loading = false;


  constructor(public store: Store<fromFeature.State>, public notifications: NotificationService,
    public sharedAccountData: SharedService) { }

  ngOnInit(){
   
    // fetching data from state
    this.store.select(fromFeature.selectDataSource).subscribe(
      (response) => {
        this.loading = response.listLoading;
        if (response.datasourceList.length > 0) {
          this.datasourceListData = response.datasourceList;
          this.datasourceListLength = this.datasourceListData.length;
          this.renderPage();
          this.tableIsEmpty = false;
        } else {
          this.tableIsEmpty = true;
        }

        // fetching suported datasources
        if (response.supportedDatasource !== null){
          this.supportedDatasources = response.supportedDatasource;
        }
      }
    );
  }

  // Below function is used if user want to refresh list data
  refreshList() {
    this.store.dispatch(DataSourceActions.loadDatasourceList());
  }

  //Below function is execute on search
  onSearch() {
    if (this.searchData !== '') {
      this.currentPage = [];
      for (let i = 0; i < this.datasourceListLength; i++) {
        this.currentPage.push(this.datasourceListData[i]);
      }
    } else {
      this.renderPage();
    }
  }

  //Below function is used to implement pagination
  renderPage() {
    this.currentPage = [];
    if (this.page.endPoint < this.datasourceListLength - 1) {
      for (let i = this.page.startingPoint; i < this.page.endPoint; i++) {
        this.currentPage.push(this.datasourceListData[i]);
      }
    } else {
      for (let i = this.page.startingPoint; i < this.datasourceListLength; i++) {
        this.currentPage.push(this.datasourceListData[i]);
      }
    }
  }

  //Below function is execute on change of perPage dropdown value
  onChangePerPageData() {
    this.page.pageSize = +this.perPageData;
    if ((this.page.startingPoint + this.page.pageSize) < this.datasourceListLength) {
      this.page.endPoint = this.page.startingPoint + this.page.pageSize;
    } else {
      this.page.endPoint = this.datasourceListLength;
    }
    this.renderPage();
  }

  //Below function is execute on click of page next btn
  pageNext() {
    if (this.page.endPoint < this.datasourceListLength - 1) {
      this.page.pageNo += 1;
      this.page.currentPage = this.page.pageNo;
      if ((this.page.endPoint + this.page.pageSize) < this.datasourceListLength) {
        this.page.startingPoint += this.page.pageSize;
        this.page.endPoint += this.page.pageSize;
      } else if (this.page.endPoint < this.datasourceListLength) {
        this.page.startingPoint = this.page.endPoint;
        this.page.endPoint = this.datasourceListLength - 1;
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

  //Below function is executes on click of page btn exist in pagination
  showPage(currentPage) {
    this.page.pageNo = currentPage;
    this.page.startingPoint = (currentPage - 1) * this.page.pageSize;
    if (currentPage * this.page.pageSize < this.datasourceListLength) {
      this.page.endPoint = currentPage * this.page.pageSize;
    } else {
      this.page.endPoint = this.datasourceListLength - 1;
    }
    this.renderPage();
  }

  // Below function is use to rectify type of datasource belong to onselect of datasource from list
  onselectDatasource(operationPerform,accountData,index){
    this.accountBelongsTo = '';
    this.supportedDatasources['oesDataSources'].forEach(oeslist => {
      if(oeslist.datasourceType === accountData.datasourceType){
        this.accountBelongsTo = 'OES'
      }
    });
    if(this.accountBelongsTo === ''){
      this.supportedDatasources['autopilotDataSources'].forEach(oeslist => {
        if(oeslist.datasourceType === accountData.datasourceType){
          this.accountBelongsTo = 'AP'
        }
      });
    }

    // below logic is use to perform specific operation
    if(operationPerform === 'Delete'){
      this.deleteAccount(accountData,index);
    }
   
  }

  // Below function is use to delete existiong account
  deleteAccount(account: any, index) {
    $("[data-toggle='tooltip']").tooltip('hide');
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        if(this.accountBelongsTo === 'OES'){
          this.store.dispatch(DataSourceActions.deleteOESDatasourceAccount({ accountName: account.displayName, index: index }));
        }
      } 
    })
  }

  // Below function is use to close the model.
  getClose(event) {
    if (event) {
      this.closeAddExpenseModal.nativeElement.click();
    }
  }

  
}
