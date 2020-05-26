import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      name: ['', Validators.required],
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

      // display form values on success
      alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.dockerForm.value));
    // this.sharedService.saveData(JSON.stringify(this.gitForm.value).
    //this.postDataDetails = this.dockerForm.value;
      this.sharedService.saveData(this.dockerForm.value).subscribe((response: any) => {
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
      this.dockerForm.reset();
  }
}
