import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-docker-form',
  templateUrl: './docker-form.component.html',
  styleUrls: ['./docker-form.component.less']
})
export class DockerFormComponent implements OnInit {
  dockerForm: FormGroup;
  submitted = false;
  
  constructor(private formBuilder: FormBuilder,private sharedService: SharedService,
    private notifications: NotificationService) { }

  ngOnInit(): void {
    this.dockerForm = this.formBuilder.group({
      account_type: ['DOCKERHUB'],
      name: ['', Validators.required,this.validateDatasourceName.bind(this)],
      endPoint: [''],
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

    // convenience getter for easy access to form fields
    get df() { return this.dockerForm.controls; }

    onSubmit() {
      this.submitted = true;
   
      // stop here if form is invalid
      if (this.dockerForm.invalid) {
          return;
      }
      this.sharedService.saveData(this.dockerForm.value).subscribe((response: any) => {
       this.notifications.showSuccess("Success",response.message);
     },
     (error) => {
       console.log("erroeUI",error);
       this.notifications.showError("Error",error.message);
       //alert('hello');
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
      this.dockerForm.reset();
  }
}
