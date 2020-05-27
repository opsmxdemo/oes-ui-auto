import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as PolicyActions from './store/policyManagement.actions'
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { PolicyManagement } from '../models/policyManagement/policyManagement.model';
import { Observable } from 'rxjs/internal/Observable';
import { SharedService } from '../services/shared.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-policy-management',
  templateUrl: './policy-management.component.html',
  styleUrls: ['./policy-management.component.less']
})
export class PolicyManagementComponent implements OnInit {

  loading=false;                                         // It is use to show and hide loader
  searchData: string = ''                                // It is use for search purpose
  endpointForm: FormGroup;                               // For Endpoint Section.
  policyForm: FormGroup;                                 // For Policy section.
  fileContent: any;                                      // For file data.
  endpointTypes: any = null;                             // It is use to store endpoint type dropdown data
  currentTableContent = [];                              // It is use to store current table data.
  policyData:PolicyManagement = null;                    // It is use to store whole form data use to send to backend.
  currentTab = 'DYNAMIC';                                // It is use to store value of current tab.
  policyCounter = 0;                                     // It is use to call policyData initially
  editPolicyData:PolicyManagement = null;                // It is use to store edit application data. 
  viewOnly:boolean = true;                               // It is use to set readonly mode in policy form
  editMode:boolean = false;                              // It is use to set edit Mode in policy form

  constructor(public store: Store<fromApp.AppState>,
              public sharedService: SharedService,) {}

  ngOnInit(){

     // fetching data from State
     this.store.select('policy').subscribe(
      (resData) => {
        this.loading = resData.loading;
        this.viewOnly = resData.readonlyMode;
        this.editMode = resData.editMode;
        if(resData.dynamicTableData !== null){
          if(this.currentTab === 'DYNAMIC'){
            this.currentTableContent = resData.dynamicTableData;
            this.fetchInitialData(this.currentTableContent);
          }
          // else{
          //   this.currentTableContent = resData.staticTableData;
          // }
        }
        this.endpointTypes = resData.endpointTypeData;
        if(resData.editPolicyData !== null && resData.editPolicyData !== undefined){
          this.editPolicyData = resData.editPolicyData;
          if(resData.editMode || resData.readonlyMode){
            // Populating endpointForm in edit mode
            this.endpointForm = new FormGroup({
              endpointType: new FormControl(this.editPolicyData.endpointType),
              endpointUrl: new FormControl(this.editPolicyData.endpoint)
            });
            // defining reactive form approach for policyForm
            this.policyForm = new FormGroup({
              name: new FormControl(this.editPolicyData.name),
              description: new FormControl(this.editPolicyData.description,Validators.required),
              status: new FormControl(this.editPolicyData.status == 'INACTIVE'?false:true),
              rego: new FormControl(this.editPolicyData.rego)
            });
          }
        }else{
          // Defining Form
          this.defineForms();
        }
        if(resData.errorMode && resData.editPolicyData !== null){
          this.endpointForm.setValue({
            endpointUrl: this.editPolicyData.endpoint,
            endpointType: this.endpointTypes
          });
          this.policyForm.setValue({
            name: this.editPolicyData.name,
            description: this.editPolicyData.description,
            status: this.editPolicyData.status,
            rego: this.editPolicyData.rego
          })
        }
      }
    )
  }

  // Below function is use to define forms
  defineForms(){
    // defining reactive form approach for endpointForm
    this.endpointForm = new FormGroup({
      endpointType: new FormControl('',Validators.required),
      endpointUrl: new FormControl('',Validators.required)
    });

    // defining reactive form approach for policyForm
    this.policyForm = new FormGroup({
      name: new FormControl('',[Validators.required,this.cannotContainSpace.bind(this)],this.valitatePolicyName.bind(this)),
      description: new FormControl('',Validators.required),
      status: new FormControl(true),
      rego: new FormControl('')
    });
  }

  // Below function is use to call initial API of policy data
  fetchInitialData(data){
    if(this.policyCounter === 0){
      this.policyCounter++;
      this.store.dispatch(PolicyActions.editPolicy({policyName:data[0].policyName,editMode:false,readonlyMode:true}));
    }
  } 

  //Below function is custom valiadator which is use to validate inpute contain space or not. If input contain space then it will return error
  cannotContainSpace(control: FormControl): {[s: string]: boolean} {
    let startingValue = control.value.split('');
  if(startingValue.length > 0 && (control.value as string).indexOf(' ') >= 0){
    return {containSpace: true}
  }
  return null;
  }

  // Below function is custom valiadator which is use to validate application name through API call, if name is not exist then it allows us to proceed.
  valitatePolicyName(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.sharedService.validatePolicyName(control.value, 'dynamic').subscribe(
        (response) => {
          if (response['policyExists'] === true) {
            resolve({ 'policyExists': true });
          } else {
            resolve(null);
          }
        }
      )
    });
    return promise;
  }

  // Below function is use to show policy details on select of policy name
  policyView(policyName){
    this.store.dispatch(PolicyActions.editPolicy({policyName:policyName,editMode:false,readonlyMode:true}));
  }

  // Below function is use to support search functionality
  onSearch(){
    console.log("search",this.searchData);
  }

  // Below function is use to policy edit
  editPolicy(policyName){
    $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(PolicyActions.editPolicy({policyName:policyName,editMode:true,readonlyMode:false}));
  }

  // Below function is use to policy delete
  deletePolicy(policyname,index){
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
        if(this.editPolicyData.name !== policyname){
          this.store.dispatch(PolicyActions.deletePolicy({policyName:policyname}))
        }else{
          if(index+1 < this.currentTableContent.length){
            this.store.dispatch(PolicyActions.editPolicy({policyName:this.currentTableContent[index+1].policyName,editMode:false,readonlyMode:true}));
          }else{
            this.store.dispatch(PolicyActions.editPolicy({policyName:this.currentTableContent[index-1].policyName,editMode:false,readonlyMode:true}));
          }
          this.store.dispatch(PolicyActions.deletePolicy({policyName:policyname}))
        }
      }
    })
  }

  // Below function is use to load file content
  loadFileContent(){
    Swal.fire({
      title: 'Load file of .rego extention',
      input: 'file',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      preConfirm: (fileList) => {
        let ext = fileList.name.split('.');
        if(ext[1]==='rego'){
          let file = fileList;
          let fileReader: FileReader = new FileReader();
          fileReader.onloadend = (x) => {
            this.fileContent = fileReader.result;
            this.policyForm.patchValue({
              rego:this.fileContent
            })
            
          }
          fileReader.readAsText(file);
        }else{
          Swal.showValidationMessage(
            `Request failed: Selected file is not .rego extention`
          )
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

  // Below function is use to reset form on click new policy btn
  newPolicy(){
    this.store.dispatch(PolicyActions.createPolicy());
    this.defineForms();
  }

  // Below function is execute on tab change.i.e, dynamic or static polices
  onChangeTab(event){
    this.currentTab = event.target.id;
    // fetching data from State
    this.store.select('policy').subscribe(
      (resData) => {
        if(resData.dynamicTableData !== null){
          if(this.currentTab === 'DYNAMIC'){
            this.currentTableContent = resData.dynamicTableData;
          }
          // else{
          //   this.currentTableContent = resData.staticTableData;
          // }
        }
      }
    )
    // this.policyForm.reset();
    // this.policyForm.patchValue({
    //   status:true
    // })
  }
  

  // Below function is execute on submission of whole form
  submitForm(){
    if(this.endpointForm.valid && this.policyForm.valid){
      this.policyData = this.policyForm.value;
      if(typeof this.policyData.status !== 'string'){
        if(this.policyData.status){
          this.policyData.status = "ACTIVE";
        }else{
          this.policyData.status = "INACTIVE";
        }
      }
      this.policyData.endpoint = this.endpointForm.value.endpointUrl;
      this.policyData.endpointType = this.endpointForm.value.endpointType;
      this.policyData.type = this.currentTab;
      this.store.dispatch(PolicyActions.savePolicy({policyForm:this.policyData}));
    }else{
      this.policyForm.markAllAsTouched();
      this.endpointForm.markAllAsTouched()
    }
  }

}
