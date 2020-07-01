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

  loading=false;                                         // It is use to show and hide loader.
  searchData: string = ''                                // It is use for search purpose.
  endpointForm: FormGroup;                               // For Endpoint Section.
  policyForm: FormGroup;                                 // For Policy section.
  fileContent: any;                                      // For file data.
  endpointTypes: any = null;                             // It is use to store endpoint type dropdown data
  currentTableContent = [];                              // It is use to store current table data.
  policyData:PolicyManagement = null;                    // It is use to store whole form data use to send to backend.
  currentTab = 'RUNTIME';                                // It is use to store value of current tab.
  dynamicPolicyCounter = 0;                              // It is use to call Dynamic policyData initially.
  staticPolicyCounter = 0;                               // It is use to call Static policyData initially.
  editPolicyData:PolicyManagement = null;                // It is use to store edit application data. 
  viewOnly:boolean = true;                               // It is use to set readonly mode in policy form.
  editMode:boolean = false;                              // It is use to set edit Mode in policy form.
  isDataEmpty:boolean = false;                           // It is use to show and hide empty screen on basics of table data.
  staticPolicyData:PolicyManagement = null;              // It is use to store static policy data and used at time of switching b/w tabs to populate forms.
  dynamicPolicyData:PolicyManagement = null;             // It is use to store dynamic policy data and used at time of switching b/w tabs to populate forms.

  constructor(public store: Store<fromApp.AppState>,
              public sharedService: SharedService,) {}

  ngOnInit(){
    this.defineForms();
     // fetching data from State
     this.store.select('policy').subscribe(
      (resData) => {
        this.loading = resData.loading;
        this.viewOnly = resData.readonlyMode;
        this.editMode = resData.editMode;
        this.endpointTypes = resData.endpointTypeData;
        if(resData.runtimeTableData !== null || resData.compliantPipelineTableData !== null){
          if(this.currentTab === 'RUNTIME' && resData.runtimeTableData.length>0){
            this.currentTableContent = resData.runtimeTableData;
            this.isDataEmpty = false;
            this.dynamicPolicyData = resData.runtimeEditPolicyData;
            this.fetchInitialData(this.currentTableContent);
            this.populateForms(resData.runtimeEditPolicyData,resData.editMode,resData.readonlyMode,resData.errorMode);
          }else if(this.currentTab === 'COMPLIANT_PIPELINE' && resData.compliantPipelineTableData.length>0){
            this.currentTableContent = resData.compliantPipelineTableData;
            this.isDataEmpty = false;
            this.staticPolicyData = resData.compliantPipelineEditPolicyData;
            this.fetchInitialData(this.currentTableContent);
            this.populateForms(resData.compliantPipelineEditPolicyData,resData.editMode,resData.readonlyMode,resData.errorMode);
          }else{
            this.isDataEmpty = true;
            this.currentTableContent = [];
          }
        }
      }
    )
  }

  // Below function is use to populate appropriate value in policy and end point form on basics of read,edit and error mode
  populateForms(editPolicyData,editMode,readonlyMode,errorMode){
   
    if(editPolicyData !== null && editPolicyData !== undefined){
      this.editPolicyData = editPolicyData;
      if(editMode || readonlyMode){
        // Populating endpointForm in edit mode
        this.endpointForm = new FormGroup({
          endpointType: new FormControl(this.editPolicyData.endpointType),
          endpointUrl: new FormControl(this.editPolicyData.endpoint)
        });
        // Populating PolicyForm in edit mode
        this.policyForm = new FormGroup({
          name: new FormControl(this.editPolicyData.name),
          description: new FormControl(this.editPolicyData.description,Validators.required),
          status: new FormControl(this.editPolicyData.status == 'INACTIVE'?false:true),
          rego: new FormControl(this.editPolicyData.rego)
        });
      }
    }else{
      // Defining Form if not in edit or readonly mode
      this.defineForms();
    }

    // If Api returns error after submission of form
    if(errorMode && editPolicyData !== null){
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
    if(this.currentTab === 'RUNTIME' && data.length>0 && this.dynamicPolicyCounter === 0){
      this.dynamicPolicyCounter++;
      this.store.dispatch(PolicyActions.editPolicy({policyName:data[0].policyName,editMode:false,readonlyMode:true,relatedTab:this.currentTab}));
    }else if(this.currentTab === 'COMPLIANT_PIPELINE' && data.length>0 && this.staticPolicyCounter === 0){
      this.staticPolicyCounter++;
      this.store.dispatch(PolicyActions.editPolicy({policyName:data[0].policyName,editMode:false,readonlyMode:true,relatedTab:this.currentTab}));
    }else{
      this.populateForms(this.currentTab === 'RUNTIME'?this.dynamicPolicyData:this.staticPolicyData,false,true,false);
    }
    
  } 

  //Below function is custom valiadator which is use to validate inpute contain space or not. If input contain space then it will return error
  cannotContainSpace(control: FormControl): {[s: string]: boolean} {
    if(control.value !== '' && control.value !== null){
      let startingValue = control.value.split('');
      if(startingValue.length > 0 && (control.value as string).indexOf(' ') >= 0){
        return {containSpace: true}
      }
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
    this.store.dispatch(PolicyActions.editPolicy({policyName:policyName,editMode:false,readonlyMode:true,relatedTab:this.currentTab}));
  }

  // Below function is use to support search functionality
  onSearch(){
    console.log("search",this.searchData);
  }

  // Below function is use to policy edit
  editPolicy(policyName){
    $("[data-toggle='tooltip']").tooltip('hide');
    this.store.dispatch(PolicyActions.editPolicy({policyName:policyName,editMode:true,readonlyMode:false,relatedTab:this.currentTab}));
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
            this.store.dispatch(PolicyActions.editPolicy({policyName:this.currentTableContent[index+1].policyName,editMode:false,readonlyMode:true,relatedTab:this.currentTab}));
          }else{
            this.store.dispatch(PolicyActions.editPolicy({policyName:this.currentTableContent[index-1].policyName,editMode:false,readonlyMode:true,relatedTab:this.currentTab}));
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
    this.isDataEmpty = false;
  }

  // Below function is execute on tab change.i.e, dynamic or static polices
  onChangeTab(event){
    this.currentTab = event.target.id;
    this.policyForm.reset();
    this.endpointForm.reset();
    this.store.dispatch(PolicyActions.changeTab());
    // fetching data from State
    this.store.select('policy').subscribe(
      (resData) => {
        if(resData.runtimeTableData !== null){
          if(this.currentTab === 'RUNTIME'){
            if(resData.runtimeTableData.length>0){
              this.currentTableContent = resData.runtimeTableData;
              this.isDataEmpty = false;
            }else{
              this.isDataEmpty = true;
              this.currentTableContent = [];
            }
            
          }
          else if (this.currentTab === 'COMPLIANT_PIPELINE' || this.currentTab === ''){
            this.currentTab = 'COMPLIANT_PIPELINE';
            if(resData.compliantPipelineTableData.length>0){
              this.currentTableContent = resData.compliantPipelineTableData;
              this.isDataEmpty = false;
            }else{
              this.isDataEmpty = true;
              this.currentTableContent = [];
            }
          }
          this.fetchInitialData(this.currentTableContent);
        }
      }
    )
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
      this.store.dispatch(PolicyActions.savePolicy({policyForm:this.policyData,relatedTab:this.currentTab}));
    }else{
      this.policyForm.markAllAsTouched();
      this.endpointForm.markAllAsTouched()
    }
  }

}
