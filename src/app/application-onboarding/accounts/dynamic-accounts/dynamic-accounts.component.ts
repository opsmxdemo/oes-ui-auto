import { Component, OnInit } from '@angular/core';
import * as fromFeature from '../../store/feature.reducer';
import * as AccountsActions from '../store/accounts.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dynamic-accounts',
  templateUrl: './dynamic-accounts.component.html',
  styleUrls: ['./dynamic-accounts.component.less']
})
export class DynamicAccountsComponent implements OnInit {
  tableIsEmpty: boolean = false;                                                       // It use to hide table if no record exist in it.
  accountListData: any;                                                                // It use to store Accountlist data fetched from state.
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
  accountListLength: number = null;
  nameOfAccount: null;
  constructor(public store: Store<fromFeature.State>, public notifications: NotificationService,
              public sharedAccountData: SharedService) { }

  ngOnInit(): void {
    this.store.dispatch(AccountsActions.loadAccountList());

     // fetching data from state
     this.store.select(fromFeature.selectAccounts).subscribe(
      (response) => {
       if (response.accountList !== null) {
        this.accountListData = response.accountList;
        this.accountListLength = this.accountListData.length;
        this.renderPage();
        this.tableIsEmpty = false;
      }else{
        this.tableIsEmpty = true;
      }
      },
      (error) => {
        this.notifications.showError('Error',error);
      }
    );
  }

   // Below function is used if user want to refresh list data
   refreshList(){
    this.store.dispatch(AccountsActions.loadAccountList());
  } 

  //Below function is execute on search
  onSearch(){
    if(this.searchData !== ''){
      this.currentPage = [];
      for (let i = 0; i < this.accountListLength; i++) {
        this.currentPage.push(this.accountListData[i]);
      }
    }else{
      this.renderPage();
    }
  }

  //Below function is used to implement pagination
  renderPage() {
    this.currentPage = [];
    if(this.page.endPoint < this.accountListLength-1){
      for (let i = this.page.startingPoint; i < this.page.endPoint; i++) {
        this.currentPage.push(this.accountListData[i]);
      }
    }else{
      for (let i = this.page.startingPoint; i < this.accountListLength; i++) {
        this.currentPage.push(this.accountListData[i]);
      }
    }
  }

  //Below function is execute on change of perPage dropdown value
  onChangePerPageData() {
    this.page.pageSize = +this.perPageData;
    if ((this.page.startingPoint + this.page.pageSize) < this.accountListLength) {
      this.page.endPoint = this.page.startingPoint + this.page.pageSize;
    } else {
      this.page.endPoint = this.accountListLength;
    }
    this.renderPage();
  }

  //Below function is execute on click of page next btn
  pageNext() {
    if (this.page.endPoint < this.accountListLength-1) {
      this.page.pageNo += 1;
      this.page.currentPage = this.page.pageNo;
      if ((this.page.endPoint + this.page.pageSize) < this.accountListLength) {
        this.page.startingPoint += this.page.pageSize;
        this.page.endPoint += this.page.pageSize;
      } else if (this.page.endPoint < this.accountListLength) {
        this.page.startingPoint = this.page.endPoint;
        this.page.endPoint = this.accountListLength-1;
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
    if (currentPage * this.page.pageSize < this.accountListLength) {
      this.page.endPoint = currentPage * this.page.pageSize;
    } else {
      this.page.endPoint = this.accountListLength-1;
    }
    this.renderPage();
  }

  // Below function is use to redirect to create account page
  createAccount() {
    $("[data-toggle='tooltip']").tooltip('hide');
    this.sharedAccountData.setUserData([]);
    this.sharedAccountData.setAccountType('');
    debugger
    this.store.dispatch(AccountsActions.loadAccount({page:'/setup/accounts'}));
  }

  // Below function is use to edit existing account
  editAccount(data: any,type: string) {
    $("[data-toggle='tooltip']").tooltip('hide');
    //this.sharedAccountData.setUserData(data.name === 'kubernetes')
    this.sharedAccountData.setUserData(data);
    this.sharedAccountData.setAccountType(type);
    this.store.dispatch(AccountsActions.loadAccount({page:'/setup/accounts'}));
  }

  // Below function is use to delete existiong account
  deleteAccount(account: any,index) {
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
        $("[data-toggle='tooltip']").tooltip('hide');
        this.store.dispatch(AccountsActions.deleteAccount({accountName: account.name,index:index}));
      }else{
        //alert('dont delete'); 
      }
    })
  }

}
