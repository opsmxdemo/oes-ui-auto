import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { CreateAccount } from 'src/app/models/applicationOnboarding/createAccountModel/createAccount.model';
import { DynamicAccountsComponent } from 'src/app/application-onboarding/dynamic-accounts/dynamic-accounts.component'
import * as OnboardingActions from '../store/onBoarding.actions';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.less']
})
export class CreateAccountComponent implements OnInit {
  
 // createAccountForm: FormGroup;                               // Form for Account details      
  mainForm: CreateAccount = null;                             // It contain data form which send to backend after successful submission.                                                                
  accountData: CreateAccount = null;
  parentRedirection: string;
  namespacesList: [];
  readList: [];
  writeList: [];
  executeList: []; 
  postDataForm: any;

  createAccountForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    accountType: new FormControl('',[Validators.required]),
    namespaces: new FormControl('',[Validators.required]),
    read: new FormControl('',[Validators.required]),
    write: new FormControl('',[Validators.required]),
    execute: new FormControl('',[Validators.required]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });


  constructor(public sharedService: SharedService,
    public store: Store<fromApp.AppState>,
              public router: Router) { }

  ngOnInit(): void {
    this.store.select('appOnboarding').subscribe(
      (response)=> {
        if(response.accountParentPage){
          this.parentRedirection = response.accountParentPage;
        }
      }
    )
    
  console.log(this.sharedService.getUserData());
    
    this.createAccountForm.patchValue({
      name: this.sharedService.getUserData().name,
      accountType: this.sharedService.getUserData().accountType,
      namespaces: this.sharedService.getUserData().namespaces,
      read: this.sharedService.getUserData().permissions.READ,
      write: this.sharedService.getUserData().permissions.WRITE,
      execute: this.sharedService.getUserData().permissions.EXECUTE,
      //file: this.sharedService.getUserData().kubeconfigFile,
    });
  }

  get accountform(){
    return this.createAccountForm.controls;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.createAccountForm.patchValue({
        fileSource: file
      });
    }
  }

  // account form validations

  validate(){
    this.createAccountForm.markAllAsTouched();
    return this.createAccountForm.valid;
  }  
  
  //Below function is use to submit whole form and send request to backend

  submitForm(data){
    console.log(this.sharedService.getUserData());
    console.log("Submitted Data ** ",data.namespaces);
    this.namespacesList = data.namespaces.split(",");
    this.readList = data.read.split(",");
    this.writeList = data.write.split(",");
    this.executeList = data.execute.split(",");
    console.log(this.namespacesList);
    
    this.postDataForm = {
      name : data.name,
      accountType : data.accountType,
      namespaces : this.namespacesList,
      read : this.readList,
      write : this.writeList,
      execute : this.executeList
      }
      console.log();
      

    const formData = new FormData();
    formData.append('data',JSON.stringify(this.postDataForm));
   // formData.append('files', data.fileSource, 'kubeconfig');
    //formData.append('data',this.myForm.get('name').value);
    formData.append('file', this.createAccountForm.get('fileSource').value, 'kubeconfig');
    console.log('formdata',formData);
    
   this.store.dispatch(OnboardingActions.createAccount({accountData: formData}));
 
  }



  // Below function is use to redirect to parent page after click on cancel btn
  cancelForm(){
    this.router.navigate([this.parentRedirection]);
  }

}
