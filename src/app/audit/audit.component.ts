import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuditActions from './store/audit.actions';
import { PipelineCount } from '../models/audit/pipelineCount.model';
import { NotificationService } from '../services/notification.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.less']
})
export class AuditComponent implements OnInit,AfterViewInit{datepickerElement

  @ViewChild('CustomColumn') CustomColumn: ElementRef;
  @ViewChild('datedropdownbtn') datedropdownbtn: ElementRef;
  @ViewChild('dForm') dateSearchForm: NgForm;
  @ViewChild('datepickerElement') datepickeEl: ElementRef;

  pipelineCount: PipelineCount = null;                                                 // It use to store pipelineCount data.
  pipelineCountName = 'All Pipelines';                                                 // It is use to store current tab pipelineName.
  pipelineCountValue = 0;                                                              // It is use to store current pipeline count.
  allpipelineData: any = null;                                                         // It is use to store all pipeline data.
  currentTableContent: any = null;                                                     // It is use to store current table content.
  currentPage = [''];                                                                  // It is use to store current page data.
  searchData: string = '';                                                             // this is use to fetch value from search field.
  perPageData: number = 15;                                                            // this is use to populate value in perPage dropdown exist in pagination.
  page = {                                                                             // this is use to support pagination in audit page.
    startingPoint: 0,
    endPoint: 15,
    pageSize: 15,
    currentPage: 1,
    pageNo: 1,
  }
  currentDatalength: number = null;                                                    // It is used to store length of current table data.
  currentTableHeader = [''];                                                           // It is used to store column key of current table to be displayed.
  currentHeaderKeys = [];                                                              // It is used to store keys of current table content.
  showColumn = [];                                                                     // It is used to show or hide the table column on basics of user selection. 
  inlineRange: any = null;                                                             // It is used to store selectd customize date range.
  disableDatepicker = true;                                                            // It is use to disabled datepicker present in date filter.
  timerHour = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];            // It is use to store timer value in hours used in customize date filter.
  timerMinute = [];                                                                    // It is use to store timer value in minute used in customize date filter.
  currentTabData: any = null;                                                          // It is use to store current tab data to populate dynamic table

  constructor(public store: Store<fromApp.AppState>,
              public notification: NotificationService) { }

  ngAfterViewInit(){
    // Setting initial value of dateFilter form
    setTimeout(() => {
      this.dateSearchForm.setValue({
        customRadio:'allTime',
        firstdayHours: "",
        firstdayMinutes: "",
        firstdayMeridiem: "",
        lastdayHours: "",
        lastdayMinutes: "",
        lastdayMeridiem: ""
      })
    })
  }

  ngOnInit() {

    //Dispatching action to fetch data from api related to rest of tab exist in Audit
    this.store.dispatch(AuditActions.loadFinalData());

    // Fetching data from state
    this.store.select('audit').subscribe(
      (auditData) => {
        if (auditData.pipelineCount !== null){
          this.pipelineCount = auditData.pipelineCount;
          this.pipelineCountValue = this.pipelineCount.totalPipelinesCount;
        }
        if (auditData.allPipelineData !== null) {
          this.allpipelineData = auditData.allPipelineData;
          this.currentDatalength = this.allpipelineData['results'].length;
          this.currentTableContent = this.allpipelineData['results'];
          this.currentTableHeader = this.allpipelineData['headers'];
          this.currentTabData = this.allpipelineData;
          this.renderPage();
          this.createHeaders(this.allpipelineData['headerOrder']);
          this.showHideColumn();
        }
      }
    )

    // populating timerMinute variable
    if (this.timerMinute.length === 0) {
      for (let i = 1; i < 59; i++) {
        const val = i.toString();
        if (i < 10) {
          this.timerMinute.push('0' + val);
        } else {
          this.timerMinute.push(val);
        }
      }
    }
  }

  // Below function is use for preparing headers order fetched from backend.
  createHeaders(currentObj) {
    let mainObj = [null];
    for (const key in currentObj) {
      const index = currentObj[key] - 1;
      mainObj[index] = key;
    }
    this.currentHeaderKeys = mainObj;
  }

  //################### Multiple Table Logic start ########################

  // Below function is execute on click on tabs exist in navigation area
  onChangeTab(event) {
    this.currentTableContent = [];
    const currentData = event.target.id;
    this.store.select('audit').subscribe(
      (responseData) => {
        switch (currentData) {
          case 'allPipeline':
            this.currentTabData = responseData.allRunningPipelineData;
            this.pipelineCountName = 'Pipeline Runs';
            this.pipelineCountValue = this.pipelineCount.totalPipelinesRunCount;
            break;
          case 'Pipeline':
            this.currentTabData = responseData.allPipelineData;
            this.pipelineCountName = 'All Pipelines';
            this.pipelineCountValue = this.pipelineCount.totalPipelinesCount;
            break;
          // case 'lastSuccessfulDeployment':
          //   this.currentTabData = responseData.lastSuccessfulDeploymentData;
          //   break;
          // case 'failedPipeline':
          //   this.currentTabData = responseData.failedPipelineData;
          //   break;
        }
        //updating page values;
        this.page = {                                                                             
          startingPoint: 0,
          endPoint: 15,
          pageSize: 15,
          currentPage: 1,
          pageNo: 1,
        }
        //disabling customize option in datefilter
        this.disableDatepicker = true; 
        this.inlineRange = null;
        if (this.currentTabData !== null) {
          this.currentTableContent = this.currentTabData['results'];
          this.currentDatalength = this.currentTableContent.length;
          this.currentTableHeader = this.currentTabData['headers'];
          this.createHeaders(this.currentTabData['headerOrder']);
          this.showHideColumn();
          // setting date form values present in date search
          this.dateSearchForm.setValue({
            customRadio:'allTime',
            firstdayHours: "",
            firstdayMinutes: "",
            firstdayMeridiem: "",
            lastdayHours: "",
            lastdayMinutes: "",
            lastdayMeridiem: ""
          })
        }
      }
    )
    this.renderPage();
  }

  // Below function is use to apply appropriate class on basics of status
  getClass(status){
    if(status === 'SUCCEEDED'){
      return 'successStatus'
    }else{
      return 'failStatus'
    }
  }

  //################### Multiple Table Logic ends ########################

  //################### Filter logic start ################################

  // Below function is execute on search
  onSearch() {
    if (this.searchData !== '') {
      this.currentPage = [];
      for (let i = 0; i < this.currentDatalength; i++) {
        this.currentPage.push(this.currentTableContent[i]);
      }
    } else {
      this.renderPage();
    }
  }

  // Below function is use to hide datedropdown popup on click of apply and predefine selection. i.e, previous month etc.
  dateDropdown(event) {
    if (event.target.id === 'applybtn' || event.target.id === 'all-time-range' || event.target.id === 'last-month-range' || event.target.id === 'last-week-range' || event.target.id === 'last-hours-range') {
      this.datedropdownbtn.nativeElement.dispatchEvent(new Event('click'));
    }
  }

  // Below function is use to collect all value of datedropdown
  dateForm(value: any) {
    this.currentTableContent = this.currentTabData['results']
    const todayDate = new Date();
    let firstDay: any = null;
    let lastday: any = null;
    
    switch (value.customRadio) {
      case 'allTime':
        firstDay = null;
        lastday = todayDate;
        this.disableDatepicker = true;
        break;
      case 'lastMonth':
        firstDay = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1);
        firstDay = new Date(firstDay.setHours(0));
        firstDay = new Date(firstDay.setMinutes(0));
        lastday = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        lastday = new Date(lastday.setHours(23));
        lastday = new Date(lastday.setMinutes(59));
        this.disableDatepicker = true;
        break;
      case 'lastWeek':
        firstDay = new Date((todayDate.setDate(todayDate.getDate() - todayDate.getDay() - 6)));
        firstDay = new Date(firstDay.setHours(0));
        firstDay = new Date(firstDay.setMinutes(0));
        lastday = new Date(todayDate.setDate(todayDate.getDate() - todayDate.getDay() + 7));
        lastday = new Date(lastday.setHours(23));
        lastday = new Date(lastday.setMinutes(59));
        this.disableDatepicker = true;
        break;
      case 'last24Hour':
        firstDay = new Date(todayDate.setHours(todayDate.getHours() - 24));
        lastday = new Date();
        this.disableDatepicker = true;
        break;
      case 'custom':
        this.disableDatepicker = false;
        if (this.inlineRange !== null) {
          firstDay = this.calculateCustonizeDate(+value.firstdayHours, +value.firstdayMinutes, value.firstdayMeridiem, 'firstday');
          lastday = this.calculateCustonizeDate(value.lastdayHours === '' ? 11 : +value.lastdayHours,
            value.lastdayMinutes === '' ? 59 : +value.lastdayMinutes,
            value.lastdayMeridiem, 'lastday');
        }
        break;
    }
    if (lastday !== null) {
      this.filterDate(firstDay, lastday);
    }
  }

  // Below function is use to collect customize date range
  inlineRangeChange(event) {
    this.inlineRange = event;
  }

  // Below function is use to calculate exact time and return customize date with time.
  calculateCustonizeDate(hours, min, meridiem, day) {
    let finalTime = null;
    if (day === 'firstday') {
      let totalhour = null;
      totalhour = (meridiem === '' ? hours : hours + 12);
      finalTime = this.inlineRange.begin;
      finalTime = new Date(finalTime.setHours(totalhour));
      finalTime = new Date(finalTime.setMinutes(min));
    } else {
      let totalhour = null;
      totalhour = (meridiem === '' ? hours + 12 : hours);
      finalTime = this.inlineRange.end;
      finalTime = new Date(finalTime.setHours(totalhour));
      finalTime = new Date(finalTime.setMinutes(min));
    }
    return finalTime;
  }

  // Below function is use to coltrol hide of date popup on click of datepicker.
  datepicker(event) {
    event.stopPropagation();
  }

  // Below function is use to filter data on basis of selected date in dateSelection popup.
  filterDate(firstDay, lastday) {
    this.currentTableContent = this.currentTabData['results'];
    this.currentDatalength = this.currentTableContent.length;
    let searchArr = [];

    // checking startTime is exist in table or not for search
    this.currentHeaderKeys.forEach(el=>{
      if(el.includes('StartTime')){
        searchArr.push('true');
      }else{
        searchArr.push('false');
      }
    })

    // returning index of element otherwise returning -1
    const timeIndex = searchArr.indexOf('true');
    const elementKey = this.currentHeaderKeys[timeIndex];
    
    // filtering table if contain startTime in it.
    if(timeIndex > 0){
      let test = this.currentTableContent.filter(el => {
        const date = new Date(+el[elementKey]);
        if (firstDay <= date || firstDay === null) {
          if (date <= lastday) {
            return el;
          }
        }
      })
      this.currentTableContent = test;
      this.currentDatalength = this.currentTableContent.length;
      this.renderPage();
    }else{
      this.notification.showInfo('Table does not contain Start Time','Date Search');
    }
  }


  // Below function is use to show or hide column on user demand
  showHideColumn() {
    this.showColumn = [];
    for (const key in this.currentHeaderKeys) {
      this.showColumn.push('true');
    }
  }

  // Below function is use to fetch value of hidden column from hide/show column filter
  customizeColumn(event, index) {
    if (index !== 'selectAll') {
      if (event.target.checked) {
        this.showColumn[index] = 'true';
      } else {
        this.showColumn[index] = 'false';
      }
    } else {
      this.showColumn = [];
      for (const key in this.currentHeaderKeys) {
        this.showColumn.push('true');
      }
    }
    // hide column dropdown
    this.CustomColumn.nativeElement.dispatchEvent(new Event('click'));
  }

  //################### Filter logic ends ################################

  //################### pagination logic start #############################

  // Below function is used to implement pagination
  renderPage() {
    this.currentPage = [];
    if (this.page.endPoint < this.currentDatalength - 1) {
      for (let i = this.page.startingPoint; i < this.page.endPoint; i++) {
        this.currentPage.push(this.currentTableContent[i]);
      }
    } else {
      for (let i = this.page.startingPoint; i < this.currentDatalength; i++) {
        this.currentPage.push(this.currentTableContent[i]);
      }
    }
  }

  // Below function is execute on change of perPage dropdown value
  onChangePerPageData() {
    this.page.pageSize = +this.perPageData;
    if ((this.page.startingPoint + this.page.pageSize) < this.currentDatalength) {
      this.page.endPoint = this.page.startingPoint + this.page.pageSize;
    } else {
      this.page.endPoint = this.currentDatalength;
    }
    this.renderPage();
  }

  // Below function is execute on click of page next btn
  pageNext() {
    if (this.page.endPoint < this.currentDatalength) {
      this.page.pageNo += 1;
      this.page.currentPage = this.page.pageNo;
      if ((this.page.endPoint + this.page.pageSize) < this.currentDatalength) {
        this.page.startingPoint += this.page.pageSize;
        this.page.endPoint += this.page.pageSize;
      } else if (this.page.endPoint < this.currentDatalength) {
        this.page.startingPoint = this.page.endPoint;
        this.page.endPoint = this.currentDatalength;
      }
      this.renderPage();
    }
  }

  // Below function is execute on click of page prev btn
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

  // Below function is executes on click of page btn exist in pagination
  showPage(currentPage) {
    this.page.pageNo = currentPage;
    this.page.startingPoint = (currentPage - 1) * this.page.pageSize;
    if (currentPage * this.page.pageSize < this.currentDatalength) {
      this.page.endPoint = currentPage * this.page.pageSize;
    } else {
      this.page.endPoint = this.currentDatalength;
    }
    this.renderPage();
  }

  //################### pagination logic ends #############################
}
