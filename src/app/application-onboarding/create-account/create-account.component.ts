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
    console.log("Submitted Data ** ", data)
    const formData = new FormData();
    formData.append('data',data['name']);
    formData.append('data',data['accountType']);
    formData.append('data',data['namespaces']);
    formData.append('data',data['read']);
    formData.append('data',data['write']);
    formData.append('data',data['execute']);
    // formData.append('data',this.createAccountForm.get('namespaces').value);
    // formData.append('data',this.createAccountForm.get('read').value);
    // formData.append('data',this.createAccountForm.get('write').value);
    // formData.append('data',this.createAccountForm.get('execute').value);
    formData.append('file', data['file']);
    console.log('formdata',formData);
    
   
    // this.http.post('http://localhost:3000', formData)
    //   .subscribe(res => {
    //     console.log(res);
    //     alert('Uploaded Successfully.');
    //   })
  }



  // Below function is use to redirect to parent page after click on cancel btn
  cancelForm(){
    this.router.navigate([this.parentRedirection]);
  }

}
