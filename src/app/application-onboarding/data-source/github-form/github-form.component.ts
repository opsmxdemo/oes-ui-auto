import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-github-form',
  templateUrl: './github-form.component.html',
  styleUrls: ['./github-form.component.less']
})
export class GithubFormComponent implements OnInit {
  gitForm: FormGroup;
  credentialsType = [];
  submitted = false;
  selectedType: string;
  gitType: string;
  satya: any;

  constructor(private formBuilder: FormBuilder,private sharedService: SharedService,
    private notifications: NotificationService) { }

  ngOnInit(): void {
    this.gitForm = this.formBuilder.group({
      credentialsType: ['', Validators.required],
      endPoint: ['', Validators.required],
      name: ['', Validators.required],
      username: ['', []],
      password: ['', []],
      gitToken: ['',],
      clouddriver: [false],
      account_type:['GITHUB']
  });
  //this.gitType = 'Credentials';
  this.credentialsType = this.getcredentialsType();
 this.selectedType = 'credentials';
 this.gitForm.patchValue({
 credentialsType: 'credentials',
});
  }

   // convenience getter for easy access to form fields
   get g() { return this.gitForm.controls; }

   // getter for get gitToken data
   getcredentialsType() {
    return [
      { id: '1', type: 'credentials' },
      { id: '2', type: 'token' }
    ];
  }

  //  //Below function is custom valiadator which is use to validate application name through API call, if name is not exist then it allows us to proceed.
  //  validateGitAccountName(control: FormControl): Promise<any> | Observable<any> {
  //   const promise = new Promise<any>((resolve, reject) => {
  //     this.sharedService.validateApplicationName(control.value, 'application').subscribe(
  //       (response) => {
  //         if (response['applicationExist'] === true) {
  //           resolve({ 'applicationExist': true });
  //         } else {
  //           resolve(null);
  //         }
  //       }
  //     )
  //   });
  //   return promise;
  // }

  changeType(e){
    this.selectedType = e.target.value;
    if(this.selectedType === 'token'){
      this.gitForm.value.username = '';
      this.gitForm.value.password = '';
    }
    //this.satya = this.gitForm.value.type;
    // if(this.selectedType === 'Token'){
    //   this.gitForm = this.formBuilder.group({
    //     credentialsType: ['', ],
    //     endPoint: [this.gitForm.value.endPoint, Validators.required],
    //     accountName: [this.gitForm.value.accountName, Validators.required],
    //     userName: ['', []],
    //     password: ['', []],
    //     gitToken: ['',[Validators.required]],
    //     setRemoteTerms: [true, Validators.requiredTrue]
    // });
    // }


  }

   onSubmit() {
       this.submitted = true;
    
       // stop here if form is invalid
       if (this.gitForm.invalid) {
           return;
       }

       // display form values on success
       //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.gitForm.value, null, 4));
      // this.sharedService.saveData(JSON.stringify(this.gitForm.value).
       this.sharedService.saveData(this.gitForm.value).subscribe((response: any) => {
        this.notifications.showSuccess("Success",response.message);
      },
      (error) => {
        console.log("erroeUI",error);
        
        this.notifications.showError("Error",error.message);
        //alert('hello');
      });
   }

   onReset() {
       this.submitted = false;
       this.gitForm.reset();
   }

}
