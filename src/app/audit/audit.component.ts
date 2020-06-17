import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuditActions from './store/audit.actions';
import { PipelineCount } from '../models/audit/pipelineCount.model';
import { NotificationService } from '../services/notification.service';
import { NgForm, FormGroup, Validators, FormControl } from '@angular/forms';
import * as $ from 'jquery';
import { Observable } from 'rxjs/internal/Observable';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2'
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [
  trigger('expandableRow', [
    state('collapsed, void', style({
      height: '0px',
      visibility: 'hidden',
      opacity:0
    })),
    state('expanded', style({
      'height': '*',
      visibility: 'visible',
      opacity:1
    })),
    transition(
      '* <=> expanded, expanded <=> collapsed',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
    ),
    transition(
      '* => collapsed',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
    ),
  ])
  ]
})
export class AuditComponent implements OnInit{

  @ViewChild('SaveFilter') SaveFilter: ElementRef;
  @ViewChild('CustomColumn') CustomColumn: ElementRef;
  @ViewChild('AddMoreFilters') AddMoreFilters: ElementRef;
  @ViewChild('datedropdownbtn') datedropdownbtn: ElementRef;
  @ViewChild('dForm') dateSearchForm: NgForm;
  @ViewChild('filterForm') filterForm: NgForm;

  pipelineCount: PipelineCount = null;                                                 // It use to store pipelineCount data.
  pipelineCountName = 'All Pipelines';                                                 // It is use to store current tab pipelineName.
  pipelineCountValue = 0;                                                              // It is use to store current pipeline count.
  tableData: any = null;                                                               // It is use to store all pipeline data.
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
  advanSearchMode = false;                                                             // It is use to switch filter or search option between advance and normal mode.
  currentDatalength: number = null;                                                    // It is used to store length of current table data.
  currentTableHeader = [''];                                                           // It is used to store column key of current table to be displayed.
  currentHeaderKeys = [];                                                              // It is used to store keys of current table content.
  showColumn = [];                                                                     // It is used to show or hide the table column on basics of user selection. 
  inlineRange: any = null;                                                             // It is used to store selectd customize date range.
  disableDatepicker = true;                                                            // It is use to disabled datepicker present in date filter.
  timerHour = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];            // It is use to store timer value in hours used in customize date filter.
  timerMinute = [];                                                                    // It is use to store timer value in minute used in customize date filter.
  currentTabData: any = null;                                                          // It is use to store current tab data to populate dynamic table.

  // Below variable is use for filters
  disabledfilter = false;
  limitSelection = false;
  dropdownSettings: any = {};
  filtersData: any;                                                                    // It is use to store filter data of current table.
  selectedFilters = [];                                                                // It is use to store selected filter data
  showHideFilter = [];                                                                 // It is use to show and hide filter dropdown option .
  relatedApi: string = 'pipelineconfig';                                               // It is use to store value of which api should call on click of apply filter.
  saveFilterForm: FormGroup;                                                           // It is use to store name of filter which user want to save and used it in future
  savedFilters: any = null;                                                            // It is use to store value of saved filters exist in particular table.
  selectedSaveFilter:string = '';                                                      // It is use to store selected filter value in it.
  treeView = [];                                                                       // It is use to store array to hide or show tree view row.
  treeView_rowanimation = 'collapsed';                                                 // It is use to store value of animation state to represent animation in tree view
  treeView_currentKey = '';                                                            // It is use to store value of currenttab key value of treeView. 
  

  constructor(public store: Store<fromApp.AppState>,
              public notification: NotificationService,
              public sharedService: SharedService,
              private elRef:ElementRef) { }

  ngOnInit() {

    //Dispatching action to fetch data from api related to rest of tab exist in Audit
    this.store.dispatch(AuditActions.loadFinalData());

    // setting filter default setting
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter:true,
      minWidth:180
    };

    // Below is reactive form defining for save filter functionality
    this.saveFilterForm = new FormGroup({
      filterName: new FormControl('',Validators.required,this.validateFilterName.bind(this))
    });


    // Fetching data from state
    this.store.select('audit').subscribe(
      (auditData) => {
        if (auditData.pipelineCount !== null){
          this.pipelineCount = auditData.pipelineCount;
          this.pipelineCountValue = this.pipelineCount.totalPipelinesCount;
        }
        if (auditData.allPipelineData !== null) {
          switch(this.relatedApi){
            case 'pipelineconfig':
              this.tableData = auditData.allPipelineData;
              break;
            case 'pipeline':
              this.tableData = auditData.allRunningPipelineData;
              break;
            case 'policies':
              this.tableData = auditData.allpolicy;
              break;
          }
          this.currentDatalength = this.tableData['results'].length;
          this.currentTableContent = this.tableData['results'];
          this.currentTableHeader = this.tableData['headers'];
          this.filtersData = this.tableData['filters'];
          this.currentTabData = this.tableData;
          this.createHeaders(this.tableData['headerOrder']);
          this.savedFilters = this.tableData['savedFilters']['filters']
          if(typeof (this.tableData['savedFilters']['selectedFilter']) === 'string'){
            this.selectedSaveFilter = this.tableData['savedFilters']['selectedFilter'];
          }else{
            this.selectedSaveFilter='';
          }
          this.fetchTreeViewKey(this.currentTableHeader);
          this.showHideColumn();
          this.selectedFilter();
          if(!auditData.treeViewMode){
            this.renderPage();
          }
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

  // Below function is use to fetch current key of treeview fron headers
  fetchTreeViewKey(currentHeader){
    for (const key in currentHeader) {
      if(key.includes('TreeView')){
        this.treeView_currentKey = key;
      }
    }
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
            this.relatedApi = 'pipeline';
            break;
          case 'Pipeline':
            this.currentTabData = responseData.allPipelineData;
            this.pipelineCountName = 'All Pipelines';
            this.pipelineCountValue = this.pipelineCount.totalPipelinesCount;
            this.relatedApi = 'pipelineconfig';
            break;
          case 'Policy':
            this.currentTabData = responseData.allpolicy;
            this.pipelineCountName = 'All Policies';
            this.pipelineCountValue = responseData.allpolicy['results'].length;
            this.relatedApi = 'policies';
            break;
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
          this.fetchTreeViewKey(this.currentTableHeader);
          // resetting filter object when tab changes
          if(this.currentTabData['filters'].length > 0){
            this.filtersData = this.currentTabData['filters'];
            this.selectedFilter();
          }else{
            this.filtersData = [];
          }
          // resetting saved filters data when tab changes
          this.savedFilters = this.currentTabData['savedFilters']['filters'];
          if(typeof (this.currentTabData['savedFilters']['selectedFilter']) === 'string'){
            this.selectedSaveFilter = this.currentTabData['savedFilters']['selectedFilter'];
          }else{
            this.selectedSaveFilter='';
          }
        }
      }
    )
    //updating page values;
    this.page = {                                                                             
      startingPoint: 0,
      endPoint: 15,
      pageSize: 15,
      currentPage: 1,
      pageNo: 1,
    }
    this.renderPage();
    this.advanSearchMode = false;
  }

  // Below function is use to apply appropriate class on basics of status
  getClass(status){
    if(status === 'SUCCEEDED'){
      return 'successStatus'
    }else{
      return 'failStatus'
    }
  }

  // Below function is use to see nested row 
  onClickNestedRow(index,event,application,pipelineconfigId,eventId){
    
    if(this.treeView.indexOf(true) === -1){
      this.treeView[index] = true;
      this.treeView_rowanimation = 'expanded';
      event.target.style.transform = 'rotate(90deg)';
      const treeViewObj = {
        appName:application,
        pipelineConfigId:pipelineconfigId,
        eventId:eventId !== undefined?eventId:''
      }
     this.store.dispatch(AuditActions.loadTreeView({callingApiData:treeViewObj,relatedApi:this.relatedApi}));
    }else{
      const index_val = this.treeView.indexOf(true);
      this.treeView[index_val] = false;
      this.treeView_rowanimation = 'collapsed';
      this.elRef.nativeElement.querySelector('#treeview'+index_val).style.transform = 'rotate(0deg)';
      if(index !== index_val){
        this.onClickNestedRow(index,event,application,pipelineconfigId,eventId);
      }
    }
  }

  //################### Multiple Table Logic ends ########################

  //################### Filter logic start ################################

  // Below function is execute once user selected saved filter
  onSelectSavedFilter(){
    this.store.dispatch(AuditActions.selectedFilterCall({filtername:this.selectedSaveFilter,relatedApi:this.relatedApi}))
  }

  // Below function is custom valiadator which is use to validate filter name through API call, if name is not exist then it allows us to proceed.
  validateFilterName(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.sharedService.validateFiltersName(control.value,this.relatedApi).subscribe(
        (response) => {
          if (response['filterExist'] === true) {
            resolve({ 'filterExist': true });
          } else {
            resolve(null);
          }
        }
      )
    });
    return promise;
  }

  // Below function is use to reset all applied filters
  resetFilters(){
    $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(AuditActions.loadDataAfterClearFilter({relatedApi:this.relatedApi}));
  }

  // Below function is use to toggle between advanced and normal search mode
  advancedModeToggle(){
    $("[data-toggle='tooltip']").tooltip('hide');
    this.advanSearchMode = !this.advanSearchMode;
    // Setting initial value of dateFilter form
    if(this.advanSearchMode === true){
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
  }

  // Below function is use to save selectedfilter value in selectedFilter array
  selectedFilter(){
    this.filtersData.forEach((el,index) => {
      this.selectedFilters[index] = el.selectedItem
      if(el.selectedItem.length > 0){
        this.showHideFilter[index] = true;
      }else{
        this.showHideFilter[index] = false;
      }
    });
  }

  // Below function is use to show hide of filter selected by user on click of add more filters
  showHideFilters(event, index) {
    if (index !== 'selectAll') {
      if (event.target.checked) {
        this.showHideFilter[index] = true;
      } else {
        this.showHideFilter[index] = false;
      }
    } else {
      this.showHideFilter = [];
      this.filtersData.forEach(element => {
        this.showHideFilter.push(true);
      });
    }
   
    // hide filter dropdown
    this.AddMoreFilters.nativeElement.dispatchEvent(new Event('click'));
  }

  //Below funstion is use on select of filter multiple values
  onItemSelect(event,category){
    if(typeof event === 'object'){
      this.filterForm.value[category] = event;
    }
    this.applyFilters();
  }

  // Below function is executed on click of apply filters
  applyFilters(){
    let filterArr = [];
    let filterObj = {};
    this.filtersData.forEach((el,index) => {
      if(this.showHideFilter[index] && this.filterForm.value[el.name].length > 0){
        let appliedfilters= {};
        appliedfilters['name']= el.name;
        appliedfilters['items']= el.items;
        appliedfilters['selectedItem']= this.filterForm.value[el.name];
        filterArr.push(appliedfilters);
      }
    });
    filterObj['filters'] = filterArr
    if(filterArr.length > 0){
      this.store.dispatch(AuditActions.postFilterData({filter:filterObj,relatedApi:this.relatedApi}));
    }else{
      this.store.dispatch(AuditActions.loadDataAfterClearFilter({relatedApi:this.relatedApi}));
    }
    
  }

  // Below function is execute on click of save filter
  saveFilter(event){
    if(this.saveFilterForm.valid){
      let savefilterObj = {};
      let mainObj = [];
      //removing items property fron filters obj
      this.filtersData.forEach((el,index) =>{
        mainObj[index] = {
          name:el.name,
          selectedItem:el.selectedItem
        }
      })
      savefilterObj['name'] = this.saveFilterForm.value.filterName;
      savefilterObj['filters'] = mainObj.filter(el => {
        if(el.selectedItem.length > 0){
          return el;
        }
      })
      
      if(savefilterObj['filters'].length > 0){
        this.store.dispatch(AuditActions.saveFilterCall({saveFilterData:savefilterObj,relatedApi:this.relatedApi}));
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Please select the filters to save it',
          showConfirmButton: false,
          timer: 1500
        })
      }
      this.saveFilterForm.reset();
      
    }else{
      this.saveFilterForm.markAllAsTouched();
      event.stopPropagation();
    }
  }

  // Below fonction is use to delete saved filter
  deleteSavedFilter(filter){
    if(this.selectedSaveFilter === filter || this.selectedSaveFilter === ''){
      this.store.dispatch(AuditActions.deleteSavedFilter({filtername:filter,isSame:true,appliedFilter:filter,relatedApi:this.relatedApi}));
    }else{
      this.store.dispatch(AuditActions.deleteSavedFilter({filtername:filter,isSame:false,appliedFilter:this.selectedSaveFilter,relatedApi:this.relatedApi}))
    }
    
  }

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
    //this.CustomColumn.nativeElement.dispatchEvent(new Event('click'));
  }

  //################### Filter logic ends ################################

  //################### pagination logic start #############################

  // Below function is used to implement pagination
  renderPage() {
    this.currentPage = [];
    this.treeView = [];
    if (this.page.endPoint < this.currentDatalength - 1) {
      for (let i = this.page.startingPoint; i < this.page.endPoint; i++) {
        this.currentPage.push(this.currentTableContent[i]);
      }
    } else {
      for (let i = this.page.startingPoint; i < this.currentDatalength; i++) {
        this.currentPage.push(this.currentTableContent[i]);
      }
    }
    // Below logic is to support tree view functionality
    if(this.currentPage.length>0){
      this.currentPage.forEach(()=>{
        this.treeView.push(false);
      })
    }
  }

  // Below function is execute on change of perPage dropdown value
  onChangePerPageData() {
    this.page.pageSize = +this.perPageData;
    this.page.startingPoint = 0;
    this.page.currentPage = 1;
    this.page.pageNo = 1;
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

  // Below function is executes on click of SpecificPageCount btn exist in pagination
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
