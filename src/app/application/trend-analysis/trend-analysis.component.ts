import { element } from 'protractor';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, HostListener, ViewEncapsulation, ElementRef, Input } from '@angular/core';
// platform-service-ui change
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { AutopiloService } from '../../services/autopilot.service';
import { NotificationService } from '../../services/notification.service';
// import { Observable } from 'rxjs';
import * as TrendAnalysis from './store/trend-analysis.actions';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import * as $ from 'jquery';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface User {
  applicationName: string;
  id: any;
  applicationId: any;
}

@Component({
  selector: 'app-trend-analysis',
  templateUrl: './trend-analysis.component.html',
  styleUrls: ['./trend-analysis.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TrendAnalysisComponent implements OnInit {
  // @Input('width') width: ElementRef;
  //Width of the graph
  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;
  @ViewChild('setChartSize') setChartSize: ElementRef;
  @ViewChild('subChartSize') subChartSize: ElementRef;


  // Chart property for Risk Score

  riskChartProperty = {                                               // It is use to stote all line chart related properties.
    showLegend: true,
    legendTitle: '',
    animations: true,
    showXAxis: true,
    showYAxis: true,
    showYAxisLabel: true,
    showXAxisLabel: true,
    xAxisLabel: 'Time',
    yAxisLabel: 'Score',
    timeline: true,
    colorScheme: {
      domain: ['#000000', '#99cc33', '#ffc0cb', '#b69f7f', '#6600cc', '#98b1e4', '#e5bfab', '#7f03c0', '#97c4f5', '#841607', '#990066', '#91fdc3', '#66cc00', '#696969', '#bada55', '#7fe5f0', '#420420', '#133337', '#f73471', '#576675', '#c39797', '#800000', '#800080', '#ff7f50', '#468499', '#008000', '#dafff9', '#7df0e0', '#4b5f81', '#cc9933', '#a6127e', '#dae0ff', '#91eec1', '#77a45c', '#e3e129', '#cacbd3', '#cc6699']
    }
  }

  issuesChartProperty = {                                               // It is use to stote all line chart related properties.
    showLegend: true,
    legendTitle: '',
    animations: true,
    showXAxis: true,
    showYAxis: true,
    showYAxisLabel: true,
    showXAxisLabel: true,
    xAxisLabel: 'Time',
    yAxisLabel: 'Issues',
    timeline: true,
    colorScheme: {
      domain: ['#a32133', '#e0392e', '#f3af70', '#7aa3e5', '#a8385d', '#aae3f5']
    }
    
  }

  // Below options to show the Stacked Vertical Bar Chart
  // showXAxis: boolean = true;
  // showYAxis: boolean = true;
  // gradient: boolean = false;
  // showLegend: boolean = true;
  // legendTitle: string = '';
  // legendPosition: "below";
  // line, area
  // autoScale:boolean = true;
  // trimXAxisTicks: boolean =false;
  // showXAxisLabel: boolean = true;
  // xAxisLabel: string = 'Country';
  // showYAxisLabel: boolean = true;
  // yAxisLabel: string = 'Population';
  // animations: boolean = true;


  applicationForm: FormGroup;
  canaries: string[] = [];
  filteredCanaries: Observable<string[]>;

  // code for showing select application shows here
  trendAnalysisRun: any;
  trendAnalysisServices: any;
  trendAnlaysisApplicationHealth = {};
  trendAnalysisServiceInfo = {};
  myControl = new FormControl();
  control = new FormControl();
  options: User[] = [];
  filteredOptions: Observable<User[]>;
  // isShow = true;
  trendAnalysisApplications: any;                           // Trend Analysis Application list will be stored

  applicationList = [
    { applicationName: '',
      applicationId: '' }
  ];

  applicationListOptions: Observable<any[]>;
  // applicationId: any;
  selectedApplicationName: any;                                   // Store the On change Application Name from input
  canaryId: number = 46;
  executeOnce: boolean = true;

  //pagination for service table
  tableIsEmpty: boolean = false;                                                       // It use to hide table if no record exist in it.
  serviceListData: any;
  serviceNameInfo = {};
  selectedServiceId: number;                                                           // It use to store Accountlist data fetched from state.
  searchData: string = '';                                                             // this is use to fetch value from search field.
  page = {                                                                             // this is use to support pagination in accunt page.
    startingPoint: 0,
    endPoint: 10,
    pageSize: 10,
    currentPage: 1,
    pageNo: 1,
  }
  counter = 1;
  latestCounter = 1;
  latestCanaryCounter = 1;
  currentPage = [];                                                                    // this use to store array of data exists in current page.
  serviceListLength: number = null;
  
  applicationHealth: any;
  trendAnalysisLoading: boolean = true;
  canaryList: any;
  initializeCanaryList: boolean = true;
  defaultServiceId: boolean = false;
  serviceNames: any[] = [];
  applicationAndServiceList: any;                                         // get the values from backend and Store for ApplicatonAnaService List
  getEndTime: number;
  getStartTime: number;
  // ngxGraphChartData: any[];

  
  // Diemension for the chartsize in the trendAnalysis
  chartSize: any[];                                                   // It is use to store graph width on change of layout widyh.
  // chartSize: number;                                                   // It is use to store graph width on change of layout.
  view: any = [];
  innerPaddingRight: number = 200;
  checkSeriesLength: boolean = false;             // Used to check if the services in the graph has array value or not

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  riskxAxisLabel: string = 'Time';
  riskyAxisLabel: string = 'Score';
  issuesxAxisLabel: string = 'Time';
  issuesyAxisLabel: string = 'Issues'
  timeline: boolean = true;

  TrendAnalysisFlag:boolean=true;
  // Creating variables for the Risk Score chart
  riskChartData: any = [];							          // used to store value from Risk score API
  createRiskChartData: any = [];					// used to create data structure for Risk score
  storeRiskSeriesValue: any = [];					// used to store push Risk "Series" Values
  riskChartsCounter: number = 0;				// used to hold object count
  riskScoreDisplay: boolean;                 // used to check if the data is present in the risk score or not

// Creating variables for the ISSUES LOGS chart
  issuesLogChartData: any;					// used to store value from Issues Logs API
  createIssuesLogChartData: any = [];			// used to create data structure for Issues logs
  storeIssuesSeries: any = [];						// used to store push Issues logs "Series" Values
  issuesLogsChartCounter: number = 0;			// used to hold object count
  issuesLogsDisplay: boolean;                               	// used to check if the data is present in the risk score or not

  
  selectedApplicationId: number;

  constructor(private route: ActivatedRoute, public sharedService: SharedService, public store: Store<fromApp.AppState>,
    public autopilotService: AutopiloService, public notifications: NotificationService, 
    private fb: FormBuilder) {
    this.control = new FormControl(this.trendAnalysisRun);
    // Object.assign(this, this.ngxGraphChartData );
    // this.riskChartData = this.riskChartData.map(group => {
    //   group.series = group.series.map(dataItem => {
    //     dataItem['name'] = new Date(dataItem['name']);
    //     // console.log("dataItem: ", dataItem['name']);
        
    //     return dataItem;
    //   })
    //   return group;
    // })

  }


  ngOnInit(): void {

    setTimeout(() => {
      this.view = [this.setChartSize.nativeElement.offsetWidth - this.innerPaddingRight, 300]
      // this.chartSize = [this.subChartSize.nativeElement.offsetWidth - 300, 300]
      // console.log("on it");
      
    }, 500)

    // hide tooltip 
    $("[data-toggle='tooltip']").tooltip('hide');
    this.getAllApplications();

    if (this.route.params['_value'].applicationName != null && this.route.params['_value'].canaryId != null) {
      this.canaryId = this.route.params['_value'].canaryId;
      this.canaryId = Number(this.route.params['_value'].canaryId);
      this.selectedApplicationName = this.route.params['_value'].applicationName;
      this.getApplicationHelathAndServiceDetails(this.canaryId);
    }
    else {
      this.store.select('auth').subscribe(
        (response) => {
          if (response.authenticated) {
            // console.log("authenticated");
            this.getLatestRun();
          }
        }
      )
    }

    this.store.select('trendAnalysis').subscribe(
      (resData) => {

        //Check Application Health
        if (resData.applicationHealthDetails != null) {
          this.trendAnalysisLoading = resData.applicationHealthDetailsLoading;
          this.trendAnlaysisApplicationHealth = resData.applicationHealthDetails;
          this.selectedApplicationName = this.trendAnlaysisApplicationHealth['applicationName'];
          if (this.trendAnlaysisApplicationHealth['error'] != null) {
            this.notifications.showError('Application health Error:', this.trendAnlaysisApplicationHealth['error']);
          }
          // this.applicationId = this.trendAnlaysisApplicationHealth['applicationId'];
        }

        //Check Service information is present or not
        if (resData.serviceInformation != null) {
          this.trendAnalysisLoading = resData.serviceInformationLoading;
          this.trendAnalysisServiceInfo = resData.serviceInformation;
          if (this.trendAnalysisServiceInfo['error'] != null) {
            this.notifications.showError('Service information Error:', this.trendAnalysisServiceInfo['error']);
          }
        }

        //Check if Service List is present or not and continue actions
        if (resData.serviceList !== null && resData.serviceListLoading) {
          this.trendAnalysisServices = [];
          this.store.dispatch(TrendAnalysis.restrictExecutionOfServices());
          this.trendAnalysisLoading = resData.serviceListLoading;
          this.trendAnalysisServices = resData.serviceList;
          // this.trendAnalysisServices.services = this.trendAnalysisServices.services != null ? this.trendAnalysisServices.services : [];
          if (this.trendAnalysisServices.services.length > 0){
            // console.log("Get Services: ", this.trendAnalysisServices.services);
            this.serviceListData = this.trendAnalysisServices.services;
            this.serviceListLength = this.trendAnalysisServices.services.length;
            this.renderPage();
            this.tableIsEmpty = false;

            //Push the services in serviceList to serviceNames
            this.trendAnalysisServices.services.forEach(element => {
              this.serviceNames.push(element);
            });

          }
          if (this.route.params['_value'].serviceId != null && this.initializeCanaryList) {
            const index = this.trendAnalysisServices.services.findIndex(services => services.serviceId == this.route.params['_value'].serviceId);
            console.log("route Parameter: ", this.route.params['_value'].serviceId);
            this.selectedServiceId = this.trendAnalysisServices.services[index].serviceId;
            this.serviceNameInfo = this.trendAnalysisServices.services[index];
            const serviceObj = this.serviceListData.find(c => c.serviceId == this.route.params['_value'].serviceId);
            this.onClickService(serviceObj);
          } else {
            if (this.trendAnalysisServices.services.length > 0 ) {
              this.selectedServiceId = this.trendAnalysisServices.services[0].serviceId;
              this.serviceNameInfo = this.trendAnalysisServices.services[0];
              // console.log("Selected Service ID: ", this.selectedServiceId);
              this.onClickService(this.trendAnalysisServices.services[0]);
            }
          }
        }

        if (resData.applicationAndServiceList != null) {
          this.riskChartData = resData.applicationAndServiceList;
          this.createRiskChartData = [];
          this.riskChartsCounter = 0; 

          this.riskChartData.forEach(eachItem => {
            this.storeRiskSeriesValue = [];
            if (eachItem['series'].length > 0) {
              this.checkSeriesLength = true;
              eachItem['series'].forEach(eachValue => {
                this.storeRiskSeriesValue.push({
                  "name": new Date(eachValue.name), "value": eachValue.value, "extra": { "canaryId": eachValue.riskAnalysisId }
                  });
              });
              this.createRiskChartData[this.riskChartsCounter] = {
                "name": eachItem.name,
                "series": this.storeRiskSeriesValue
                
              }
              this.riskChartsCounter++;
            }
          })
          // this.createRiskChartData[0].name = this.createRiskChartData[0].name + " - Application";
          if (this.checkSeriesLength ){
            this.createRiskChartData[0].name = this.createRiskChartData[0].name + " - Application";
            this.checkSeriesLength = false;
          }
          // console.log("riskChartData2: ", this.createRiskChartData);
          // this.riskxAxisLabel = "Time: " + new Date(this.getStartTime) + " - " + new Date(this.getEndTime);
          this.riskScoreDisplay = this.createRiskChartData.length === 0 ? false : true;          
        }

        if(resData.issuesLogsData != null){
          this.issuesLogChartData = resData.issuesLogsData;
          this.createIssuesLogChartData = [];
          this.issuesLogsChartCounter = 0;

          // console.log("issuesLogChartData1: ", this.issuesLogChartData);

          this.issuesLogChartData.forEach(eachItem => {
            this.storeIssuesSeries = [];
            if (eachItem['series'].length > 0){
                eachItem['series'].forEach(eachValue => {
                  this.storeIssuesSeries.push({"name": new Date(eachValue.name), "value": eachValue.value});
                });
              this.createIssuesLogChartData[this.issuesLogsChartCounter] = {
                "name": eachItem.name,
                "series": this.storeIssuesSeries
              }
              this.issuesLogsChartCounter++;              
            }
          })

          // console.log("issuesLogChartData2: ", this.createIssuesLogChartData);
          // this.issuesxAxisLabel = "Time: " + new Date(this.getStartTime) + " - " + new Date(this.getEndTime);
          this.issuesLogsDisplay = this.createIssuesLogChartData.length === 0 ? false : true;

        }


        if (resData.applicationList != null) {
          this.trendAnalysisLoading = resData.applicationListLoading;
          this.trendAnalysisApplications = resData.applicationList;
          this.applicationList = resData.applicationList;
          this.initFilterApplication();
        }
        
        if (resData.canaryId != null) {
          this.canaryId = resData.canaryId;

          // console.log("latest Application Name List: ", this.trendAnalysisApplications);

          this.trendAnalysisApplications.find(element => {
            if (element['canaryIdList'].includes(this.canaryId)) {
              this.selectedApplicationName = element['canaryIdList'].includes(this.canaryId) ? element.applicationName : null;
            }
          });

          // console.log("latest application name: ", this.selectedApplicationName);
          if (this.executeOnce) {
            this.onSelectionChangeApplication(this.selectedApplicationName);
            this.executeOnce = false;
          }

        }

      }
    );

  }

  // Below function is use to capture events occur in matric analysis component and make responsive to table.
  @HostListener('window:mousemove', ['$event'])
  setWidth() {
    // console.log("mouseEnter listener");
    
    // setTimeout(() => {
    this.view = [this.setChartSize.nativeElement.offsetWidth - this.innerPaddingRight, 300]
      // this.chartSize = [this.subChartSize.nativeElement.offsetWidth - 300, 300]
    // }, 500)
  }

  onSelectionChangeApplication(event) {
    this.canaries = [];
    this.selectedApplicationName = event;
    // console.log("Selected Event: ", event);
    
    //Return the Object from the Application List and store in d
    const d = this.applicationList.find(c => c.applicationName == this.selectedApplicationName);
    // console.log("selectedApplicationName ===================== ", d);
    
    if (d['canaryIdList'].length === 0) {
      this.canaries = [];
      this.control.setValue('');
      this.notifications.showError(this.selectedApplicationName, 'No Canaries found for the Selected Application');
      // console.log("error finding canary");

    } else {
      this.canaries = d['canaryIdList'].toString().split(",");
      this.canaries.sort();      
      this.canaries = [...new Set(this.canaries)];
      // console.log("Canaries: ", this.canaries);
      this.filteredCanaries = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCanaries(value))
      );
      // console.log("Filtered Canaries: ", this.filteredCanaries);
      
      this.selectedApplicationId = parseInt(d.applicationId);
      let selectedCan = this.canaries.map(parseFloat).sort();
      if (this.control.value != Math.max.apply(null, selectedCan)) {
        this.control.setValue(Math.max.apply(null, selectedCan));
        // this.store.dispatch(TrendAnalysis.updateCanaryRun({canaryId: Math.max.apply(null, selectedCan)}));
      }

      this.store.dispatch(TrendAnalysis.loadServices({ canaryId: Math.max.apply(null, selectedCan) }));
      this.store.dispatch(TrendAnalysis.loadApplicationHelath({ canaryId: Math.max.apply(null, selectedCan) }));
      // if (this.selectedServiceId !== undefined) {
      //   this.store.dispatch(TrendAnalysis.loadServiceInformation({ canaryId: Math.max.apply(null, selectedCan), serviceId: this.selectedServiceId !== undefined ? this.selectedServiceId : null }));
      // }

      //Calculating the current time and previous 90 days and dispatching to the backend to get the Application and Services list
      this.getEndTime = Math.round((new Date()).getTime());
      // console.log("get Current Time: ", this.getEndTime);
      this.getStartTime = this.getEndTime - 7889229000;       // Epoch time 30.44 days * 3 times = 3 months
      // console.log("get Past Time: ", this.getStartTime);
      
      // call the Application and Services List
      this.store.dispatch(TrendAnalysis.loadApplicationData({ applicationId: parseInt(d.applicationId), startTime: this.getStartTime, endTime: this.getEndTime }));

      //call selected ServiceTrendLogs
      if (this.serviceNames.length > 0 && this.serviceNames[0].serviceId != undefined){
        this.getServiceTrendForLogs(this.selectedApplicationId, this.getStartTime, this.getEndTime, this.serviceNames[0].serviceId);
      }
    }
  }

  getServiceTrendForLogs(appId, startTime, endTime, serviceId){
    // console.log("serviceList in getServiceTrendForLogs function:", this.trendAnalysisServices);
    this.store.dispatch(TrendAnalysis.loadServiceTrendLogs({ applicationId: appId, startTime: startTime, endTime: endTime, serviceId: serviceId }));
  }

  // filter for canaries
  private _filterCanaries(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.canaries.filter(canaryId => this._normalizeValue(canaryId).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value;
  }

  // get latest canary run
  getLatestRun() {
    this.store.dispatch(TrendAnalysis.loadLatestRun());
  }

  // get application details
  getAllApplications() {
    this.store.dispatch(TrendAnalysis.loadApplications());
    this.buildApplicationForm();
  }

  // Below function is used if user want to refresh list data
  refreshList() {
    this.store.dispatch(TrendAnalysis.loadServices({ canaryId: this.control.value }));
  }

  //Below function is execute on search
  onSearch() {
    if (this.searchData != '') {
      this.currentPage = [];
      for (let i = 0; i < this.serviceListLength; i++) {
        this.currentPage.push(this.serviceListData[i]);
      }
    } else {
      this.renderPage();
    }
  }

  //Below function is used to implement pagination
  renderPage() {
    this.currentPage = [];
    if (this.page.endPoint < this.serviceListLength - 1) {
      for (let i = this.page.startingPoint; i < this.page.endPoint; i++) {
        this.currentPage.push(this.serviceListData[i]);
      }
    } else {
      for (let i = this.page.startingPoint; i < this.serviceListLength; i++) {
        this.currentPage.push(this.serviceListData[i]);
      }
    }
  }

  buildApplicationForm() {
    this.applicationForm = this.fb.group({
      application: [''],
    });

  }

  //Filtering the application in input field
  initFilterApplication() {
    this.applicationListOptions = this.applicationForm
      .get('application')
      .valueChanges.pipe(
        startWith<string | any>(''),
        map(val => (typeof val === 'string' ? val : val.applicationName)),
        map(applicationName => (applicationName ? this.filterApplications(applicationName) : this.applicationList.slice()))
      );
  }

  filterApplications(applicationName: string): any[] {
    return this.applicationList.filter(option => option.applicationName.toLowerCase().indexOf(applicationName.toLowerCase()) === 0);
  }

  //on click of service
  onClickService(item: any) {
    // console.log("on Click Service: ", item);

    this.defaultServiceId = true;
    this.selectedServiceId = item.serviceId;
    this.serviceNameInfo = item;
    this.selectedServiceId = item.serviceId;

    if (this.selectedServiceId != null || this.selectedServiceId != undefined) {
      // this.store.dispatch(TrendAnalysis.loadServiceInformation({ canaryId: this.control.value, serviceId: item.serviceId }));
      this.getServiceTrendForLogs(this.selectedApplicationId, this.getStartTime, this.getEndTime, item.serviceId)

    }
  }

  // below code use to call get services list and application health info
  getApplicationHelathAndServiceDetails(runId: number) {
    // default selection of canary id
    this.control.setValue(runId);
    this.store.dispatch(TrendAnalysis.loadServices({ canaryId: runId }));
    this.store.dispatch(TrendAnalysis.loadApplicationHelath({ canaryId: runId }));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.view = [this.setChartSize.nativeElement.offsetWidth - this.innerPaddingRight, 300]
    }, 500)
  }

}
