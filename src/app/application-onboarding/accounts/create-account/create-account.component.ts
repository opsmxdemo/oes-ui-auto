import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { Store } from '@ngrx/store';
import * as fromFeature from '../../store/feature.reducer';
import { CreateAccount } from '../../../models/applicationOnboarding/createAccountModel/createAccount.model';
import * as AccountActions from '../store/accounts.actions';
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
  fileContent:any;

  createAccountForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    accountType: new FormControl('',[Validators.required]),
    namespaces: new FormControl('',[Validators.required]),
    read: new FormControl(''),
    write: new FormControl(''),
    execute: new FormControl(''),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  formData: FormData;


  constructor(public sharedService: SharedService,
    public store: Store<fromFeature.State>,
              public router: Router) { }

  ngOnInit(): void {

    if(this.sharedService.type === 'editAcc'){
      this.createAccountForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        accountType: new FormControl('',[Validators.required]),
        namespaces: new FormControl('',[Validators.required]),
        read: new FormControl(''),
        write: new FormControl(''),
        execute: new FormControl(''),
        file: new FormControl(''),
        fileSource: new FormControl('')
      });
    
    }else{

    }


    this.store.select(fromFeature.selectAccounts).subscribe(
      (response)=> {
        if(response.accountParentPage){
          this.parentRedirection = response.accountParentPage;
        }
      }
    )

    if(this.sharedService.type === 'editAcc'){
      if(this.sharedService.userData.permissions){
        this.createAccountForm.patchValue({
          name: this.sharedService.userData.name,
          accountType: 'Kubernetes',
          namespaces: this.sharedService.userData.namespaces,
          read: this.sharedService.userData.permissions.READ,
          write: this.sharedService.userData.permissions.WRITE,
          execute: this.sharedService.userData.permissions.EXECUTE,
          //file: this.sharedService.getUserData().kubeconfigFile,
        });
      }else{
        this.createAccountForm.patchValue({
          name: this.sharedService.userData.name,
          accountType: 'Kubernetes',
          namespaces: this.sharedService.userData.namespaces,
          read: '',
          write: '',
          execute: '',
          //file: this.sharedService.getUserData().kubeconfigFile,
        });
      }
     
    }
   
  }

  get accountform(){
    return this.createAccountForm.controls;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileContent = file;
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

  arr (value) {
  //  if(value === ""){
      return value.filter(function (item) {
        return item !== '';
      });
  //  }else{
    //  return value;
   // }
    //delse{
   //   return value
    //}

    if(value === ""){
      return value = [];
    }
    
  }
  
  //Below function is use to submit whole form and send request to backend

  submitForm(data){
   if(this.sharedService.getAccountType() === 'editAcc'){
    this.namespacesList = data.namespaces;
    this.readList = data.read;
    this.writeList = data.write;
    this.executeList = data.execute;

    
    if(Array.isArray(data.namespaces)){

    }else{
      if(data.namespaces == undefined){
        this.namespacesList = [];
      }else{
        this.namespacesList = data.namespaces.split(",");

      }
     
    }

    if(Array.isArray(data.read)){

    }else{
      if(data.read == undefined){
        this.readList = [];
      }else{
        this.readList = data.read.split(",");

      }
     
    }
    if(Array.isArray(data.write)){

    }else{
      if(data.write == undefined){
        this.writeList = [];
      }else{
        this.writeList = data.write.split(",");

      }
    }
    if(Array.isArray(data.execute)){

    }else{
      if(data.execute == undefined){
        this.executeList = [];
      }else{
        this.executeList = data.execute.split(",");

      }

    }
    
    

   }else{
    this.namespacesList = data.namespaces.split(",");
    this.readList = data.read.split(",");
    this.writeList = data.write.split(",");
    this.executeList = data.execute.split(",");
   }
  
 
    
   if(this.readList == undefined){
    this.readList = [];
   }
   if(this.executeList == undefined){
    this.executeList = [];
   }
    if(this.writeList == undefined){
    this.writeList = [];
   }
    this.postDataForm = {
      name : data.name,
      accountType : data.accountType,
      namespaces : this.namespacesList,
      read : this.arr(this.readList),
      write : this.arr(this.writeList),
      execute : this.arr(this.executeList)
      }


      if(this.fileContent){
        this.formData = new FormData();
        this.formData.append('files', this.fileContent,'kubeconfig');
        this.store.dispatch(AccountActions.createAccount({accountData: this.formData,postData:JSON.stringify(this.postDataForm)}));
      }else{
        this.sharedService.setUserData([]);
        this.store.dispatch(AccountActions.updateDynamicAccount({updatedAccountData: this.postDataForm}));      }

  }


  // Below function is use to redirect to parent page after click on cancel btn
  cancelForm(){
    this.createAccountForm.reset();
    this.router.navigate([this.parentRedirection]);
  }

}
