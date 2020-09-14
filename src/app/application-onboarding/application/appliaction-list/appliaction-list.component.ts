import { Component, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFeature from '../../store/feature.reducer';
import * as ApplicationActions from '../store/application.actions';
import * as AppDashboardAction from '../../../application/application-dashboard/store/dashboard.actions';
import { ApplicationList } from '../../../models/applicationOnboarding/applicationList/applicationList.model';
import * as $ from 'jquery';
import { NotificationService } from 'src/app/services/notification.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-appliaction-list',
  templateUrl: './appliaction-list.component.html',
  styleUrls: ['./appliaction-list.component.less']
})

export class AppliactionListComponent implements OnInit {
  tableIsEmpty: boolean = false;                                                       // It use to hide table if no record exist in it.
  appListData: ApplicationList []= null;                                               // It use to store Applist data fetched from state.
  searchData: string = '';                                                             // this is use to fetch value from search field.
  perPageData: number = 10;                                                            // this is use to populate value in perPage dropdown exist in pagination.
  page = {                                                                             // this is use to support pagination in audit page.
    startingPoint: 0,
    endPoint: 10,
    pageSize: 10,
    currentPage: 1,
    pageNo: 1,
  }
  currentPage = [];                                                                    // this use to store array of data exists in current page.
  appListLength: number = null;                                                        // It use to store AppList array length
  loading = false;                                                                     // It is use to show and hide loading screen

  constructor(public store: Store<fromFeature.State>,
              public toastr: NotificationService) { }
  
  ngOnInit(): void {

    
    //fetching data from state
    this.store.select(fromFeature.selectApplication).subscribe(
      (response) => {
        this.loading = response.appListLoading;
        if (response.applicationList.length > 0) {
          this.appListData = response.applicationList;
          this.appListLength = this.appListData.length;
          this.renderPage();
          this.tableIsEmpty = false;
        }else{
          this.tableIsEmpty = true;
        }
      }
    )
  }

  // Below function is used if user want to refresh list data
  refreshList(){
    $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(ApplicationActions.loadAppList());
  } 

  //Below function is execute on search
  onSearch(){
    if(this.searchData !== ''){
      this.currentPage = [];
      for (let i = 0; i < this.appListLength; i++) {
        this.currentPage.push(this.appListData[i]);
      }
    }else{
      this.renderPage();
    }
  }

  // Below function is use to redirect to create application page
  createApplication() {
    debugger
    this.store.dispatch(ApplicationActions.loadApp({page:'/setup/applications'}));
  }

  //Below function is used to implement pagination
  renderPage() {
    this.currentPage = [];
    if(this.page.endPoint < this.appListLength){
      for (let i = this.page.startingPoint; i < this.page.endPoint; i++) {
        this.currentPage.push(this.appListData[i]);
      }
    }else{
      for (let i = this.page.startingPoint; i < this.appListLength; i++) {
        this.currentPage.push(this.appListData[i]);
      }
    }
  }

  //Below function is execute on change of perPage dropdown value
  onChangePerPageData() {
    this.page.pageSize = +this.perPageData;
    this.page.startingPoint = 0;
    this.page.currentPage = 1;
    this.page.pageNo = 1;
    if ((this.page.startingPoint + this.page.pageSize) < this.appListLength) {
      this.page.endPoint = this.page.startingPoint + this.page.pageSize;
    } else {
      this.page.endPoint = this.appListLength;
    }
    this.renderPage();
  }

  //Below function is execute on click of page next btn
  pageNext() {
    if (this.page.endPoint < this.appListLength) {
      this.page.pageNo += 1;
      this.page.currentPage = this.page.pageNo;
      if ((this.page.endPoint + this.page.pageSize) < this.appListLength) {
        this.page.startingPoint += this.page.pageSize;
        this.page.endPoint += this.page.pageSize;
      } else if (this.page.endPoint < this.appListLength) {
        this.page.startingPoint = this.page.endPoint;
        this.page.endPoint = this.appListLength;
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
    if (currentPage * this.page.pageSize < this.appListLength) {
      this.page.endPoint = currentPage * this.page.pageSize;
    } else {
      this.page.endPoint = this.appListLength;
    }
    this.renderPage();
  }

  //Below function is use to delete application fron existing list
  appDelete(name,index,AppId){
    $("[data-toggle='tooltip']").tooltip('hide');
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.store.dispatch(ApplicationActions.appDelete({applicationName:name,index:index,id:AppId}));
      }
    })
    
  }

  // Below function is use for edit application
  editApplication(appData){
    $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(ApplicationActions.enableEditMode({ editMode: true, applicationName: appData.name,page:'/setup/applications',applicationId:appData.applicationId}));
  }

}
