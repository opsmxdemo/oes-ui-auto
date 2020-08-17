import { Component, OnInit } from '@angular/core';
import * as fromFeature from '../store/feature.reducer';
import * as DataSourceActions from '../data-source/store/data-source.actions';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';
import { ViewChild, ElementRef} from '@angular/core';
//import { } from '@ng-bo'

@Component({
  selector: 'app-data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.less']
})
export class DataSourceComponent implements OnInit {
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  dataSourceList: { id: string; name: string; path: string; }[];
  selectedDataProvider: any;
  tableIsEmpty: boolean = false;                                                       // It use to hide table if no record exist in it.
  datasourceListData: any;                                               // It use to store Accountlist data fetched from state.
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
  datasourceListLength: number = null;
  nameOfAccount: null;
  typeOfForm: any;

  constructor(public store: Store<fromFeature.State>, public notifications: NotificationService,
    public sharedAccountData: SharedService) { }

  ngOnInit(): void {
    this.selectedDataProvider = '';
   // this.getDataProvider("Docker");
    this.dataSourceList = [{
      "id": "new_relic",
      "name": "New Relic",
      "path": "../../assets/images/new_relic.png"
    },
    {
      "id": "prometheus",
      "name": "Prometheus",
      "path": "../../assets/images/promethics.png"
    },
    {
      "id": "dyna-trace",
      "name": "Dynatrace",
      "path": "../../assets/images/dyna-trace.png"
    },
    {
      "id": "gcp_stackdriver",
      "name": "GCP Stackdriver",
      "path": "../../assets/images/gcp-icon.png"
    },
    {
      "id": "datadog",
      "name": "Datadog",
      "path": "../../assets/images/data-dog.png"
    },
    {
      "id": "app_dynamics",
      "name": "App Dynamics",
      "path": "../../assets/images/app-dynamics.png"
    },
    {
      "id": "aws_cloudwatch",
      "name": "AWS Cloudwatch",
      "path": "../../assets/images/aws-cloudwatch.png"
    },
    {
      "id": "elastic_search",
      "name": "Elastic Search",
      "path": "../../assets/images/elastic-search.png"
    },
    {
      "id": "GITHUB",
      "name": "Github",
      "path": "../../assets/images/github.png"
    },
    {
      "id": "DOCKERHUB",
      "name": "Docker",
      "path": "../../assets/images/docker.png"
    }];
    this.store.dispatch(DataSourceActions.loadDatasourceList());

    // fetching data from state
    this.store.select(fromFeature.selectDataSource).subscribe(
     (response) => {
      if (response.datasourceList !== null) {
       this.datasourceListData = response.datasourceList;
       this.datasourceListLength = this.datasourceListData.length;
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

  getClose(){
    this.closeAddExpenseModal.nativeElement.click();
  }
  getDataProvider(e){
    this.selectedDataProvider = e;
  }

   // Below function is used if user want to refresh list data
   refreshList(){
    this.store.dispatch(DataSourceActions.loadDatasourceList());
  } 

  //Below function is execute on search
  onSearch(){
    if(this.searchData !== ''){
      this.currentPage = [];
      for (let i = 0; i < this.datasourceListLength; i++) {
        this.currentPage.push(this.datasourceListData[i]);
      }
    }else{
      this.renderPage();
    }
  }

  //Below function is used to implement pagination
  renderPage() {
    this.currentPage = [];
    if(this.page.endPoint < this.datasourceListLength-1){
      for (let i = this.page.startingPoint; i < this.page.endPoint; i++) {
        this.currentPage.push(this.datasourceListData[i]);
      }
    }else{
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
    if (this.page.endPoint < this.datasourceListLength-1) {
      this.page.pageNo += 1;
      this.page.currentPage = this.page.pageNo;
      if ((this.page.endPoint + this.page.pageSize) < this.datasourceListLength) {
        this.page.startingPoint += this.page.pageSize;
        this.page.endPoint += this.page.pageSize;
      } else if (this.page.endPoint < this.datasourceListLength) {
        this.page.startingPoint = this.page.endPoint;
        this.page.endPoint = this.datasourceListLength-1;
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
      this.page.endPoint = this.datasourceListLength-1;
    }
    this.renderPage();
  }

    // Below function is use to delete existiong account
    deleteAccount(account: any,index) {
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
        this.store.dispatch(DataSourceActions.deleteDatasourceAccount({accountName: account.name,index:index}));
        }else{
         
        }
      })
    }

    //Below function is to get the typeof the form used
    addDataSourceAccount(type:string){
      this.typeOfForm = type;
      this.selectedDataProvider = 'DOCKERHUB';
      this.sharedAccountData.setDataSourceType(this.typeOfForm);
      this.sharedAccountData.setDataSourceData('');
    }

    // Below funcion is use to edit existing account
    editAccount(account:any,index,type:string){
      this.typeOfForm = type;
      this.sharedAccountData.setDataSourceData(account);
      this.sharedAccountData.setDataSourceType(this.typeOfForm);
      if(account.account_type === 'DOCKERHUB'){
        this.selectedDataProvider = 'DOCKERHUB';
      }else if(account.account_type === 'GITHUB'){
        this.selectedDataProvider = 'GITHUB';
      }else{
        
      }
      
    }

 
}
