import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import * as PolicyActions from './store/policyManagement.actions'
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { PolicyManagement } from '../models/policyManagement/policyManagement.model';
import { Observable } from 'rxjs/internal/Observable';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-policy-management',
  templateUrl: './policy-management.component.html',
  styleUrls: ['./policy-management.component.less']
})
export class PolicyManagementComponent implements OnInit {

  searchData: string = ''                                // It is use for search purpose
  endpointForm: FormGroup;                               // For Endpoint Section.
  policyForm: FormGroup;                                 // For Policy section.
  fileContent: any;                                      // For file data.
  endpointTypes = ['OPA']
  currentTableContent = [];                              // It is use to store current table data.
  policyData:PolicyManagement = null;                    // It is use to store whole form data use to send to backend.
  currentTab = 'DYNAMIC';                                // It is use to store value of current tab.
  allowSubmit = true;

  constructor(public store: Store<fromApp.AppState>,
              public sharedService: SharedService,) {}

  ngOnInit(){

    //dispatching action for policy management
    this.store.dispatch(PolicyActions.loadPolicy({relatedTab:this.currentTab}));

     // fetching data from State
     this.store.select('policy').subscribe(
      (resData) => {
        if(resData.submited){
          this.allowSubmit = false;
        }else{
          this.allowSubmit = true;
        }
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

    // defining reactive form approach for endpointForm
    this.endpointForm = new FormGroup({
      endpointType: new FormControl('',Validators.required),
      endpointUrl: new FormControl('',Validators.required)
    });

     // defining reactive form approach for policyForm
     this.policyForm = new FormGroup({
      name: new FormControl('',Validators.required,this.valitatePolicyName.bind(this)),
      description: new FormControl('',Validators.required),
      status: new FormControl(true),
      rego: new FormControl('')
    });

    this.policyForm.valueChanges.subscribe(
      () =>{
        this.allowSubmit = true;
      }
    )

  }

  //Below function is custom valiadator which is use to validate application name through API call, if name is not exist then it allows us to proceed.
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

  // Below function is use to seport search functionality
  onSearch(){
    console.log("search",this.searchData);
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
            console.log('reader',this.fileContent);
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
    this.policyForm.reset();
    this.policyForm.patchValue({
      status:true
    })
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
        this.policyData.endpoint = this.endpointForm.value.endpointUrl;
      }
      
      this.policyData.type = this.currentTab;
      console.log("fulldata",JSON.stringify(this.policyData));
      this.store.dispatch(PolicyActions.savePolicy({policyForm:this.policyData}));
    }else{
      this.policyForm.markAllAsTouched();
      this.endpointForm.markAllAsTouched()
    }
  }

}
