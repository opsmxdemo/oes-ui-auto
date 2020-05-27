import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Observable } from 'rxjs';
import { ViewChild, ElementRef} from '@angular/core';


@Component({
  selector: 'app-github-form',
  templateUrl: './github-form.component.html',
  styleUrls: ['./github-form.component.less']
})
export class GithubFormComponent implements OnInit {
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  gitForm: FormGroup;
  credentialsType = [];
  submitted = false;
  showGitCheck = false;
  selectedType: string;
  gitType: string;
  satya: any;

  constructor(private formBuilder: FormBuilder,private sharedService: SharedService,
    private notifications: NotificationService) { }

  ngOnInit(): void {
    this.gitForm = this.formBuilder.group({
      credentialsType: ['', Validators.required],
      endPoint: ['', Validators.required],
      name: ['', Validators.required,this.validateDatasourceName.bind(this)],
      clouddriver: [false],
      account_type:['GITHUB'],
      username:  ['', Validators.required],
      password:  ['', Validators.required]
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

  // code for checking the git account
  doGitCheck(isChecked: boolean){
    if(isChecked){
      this.sharedService.validateGitAccount().subscribe((response: any) => {
        if(response.gitAccountExist === true){
          this.showGitCheck = true;
        }
      });
    }
  }

  changeType(e){
    debugger
    console.log('form-before',this.gitForm.value);
    
    this.selectedType = e.target.value;
    if(this.selectedType === 'token'){
      this.gitForm.addControl('gitToken', new FormControl('', Validators.required));
      if(this.gitForm.get('username') !== null && this.gitForm.get('password') !== null){
        this.gitForm.removeControl('username');
        this.gitForm.removeControl('password');
      }
      
     }else{
       this.gitForm.addControl('username', new FormControl('', Validators.required));
       this.gitForm.addControl('password', new FormControl('', Validators.required));
       if(this.gitForm.get('gitToken') !== null ){
        this.gitForm.removeControl('gitToken');
      }
     }
     console.log('form-after',this.gitForm.value);
  }

   onSubmit() {
       this.submitted = true;
       // stop here if form is invalid
       if (this.gitForm.invalid) {
           return;
       }
       this.sharedService.saveData(this.gitForm.value).subscribe((response: any) => {
        this.notifications.showSuccess("Success",response.message);
        this.closeAddExpenseModal.nativeElement.click();
      },
      (error) => {
        this.notifications.showError("Error",error.message);
      });
   }

   //Below function is custom valiadator which is use to validate account name through API call, if name is not exist then it allows us to proceed.
   validateDatasourceName(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.sharedService.validateDatasourceName(control.value, 'account').subscribe(
        (response) => {
          if (response['accountExist'] === true) {
            resolve({ 'accountExist': true });
          } else {
            resolve(null);
          }
        }
      )
    });
    return promise;
  }

   onReset() {
       this.submitted = false;
       this.gitForm.reset();
   }

}
