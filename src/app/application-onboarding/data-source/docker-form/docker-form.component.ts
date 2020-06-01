import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';
import {DataSourceComponent} from 'src/app/application-onboarding/data-source/data-source.component';
import { ViewChild, ElementRef} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as OnboardingActions from '../../store/onBoarding.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docker-form',
  templateUrl: './docker-form.component.html',
  styleUrls: ['./docker-form.component.less']
})
export class DockerFormComponent implements OnInit {
  dockerForm: FormGroup;
  submitted = false;
  form_type: string;
  
  constructor(private formBuilder: FormBuilder,private sharedService: SharedService,
    private notifications: NotificationService, private datasource: DataSourceComponent,
    public store: Store<fromApp.AppState>,
              public router: Router) { }

  ngOnInit(): void {
    this.dockerForm = this.formBuilder.group({
      account_type: ['DOCKERHUB'],
      name: ['', Validators.required,this.validateDatasourceName.bind(this)],
      endPoint: [''],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
   // this.form_type = 'new';
    this.form_type= this.sharedService.dataSourceType;
    if(this.sharedService.getDataSourceType() === 'edit'){
      this.dockerForm = this.formBuilder.group({
        account_type: ['DOCKERHUB'],
        name: ['', Validators.required],
        endPoint: [''],
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
      //this.form_type = 'edit';
      this.dockerForm.patchValue({
        name: this.sharedService.getDataSourceData().name,
        username: this.sharedService.getDataSourceData().username,
        password: this.sharedService.getDataSourceData().password
       });
    }else{
      this.form_type= this.sharedService.dataSourceType;
      this.dockerForm.patchValue({
        name: '',
        username: '',
        password: ''
       });
    }
   
  }

    // convenience getter for easy access to form fields
    get df() { return this.dockerForm.controls; }

    onSubmit() {
      this.submitted = true;
        // stop here if form is invalid
      if (this.dockerForm.invalid) {
          return;
      }

      if(this.form_type === 'new'){
        this.sharedService.saveData(this.dockerForm.value).subscribe((response: any) => {
          this.notifications.showSuccess("Success",response.message);
          this.store.dispatch(OnboardingActions.loadDatasourceList());
        },
        (error) => {
          console.log("erroeUI",error);
          this.notifications.showError("Error",error.message);
        });
        this.datasource.getClose();
      }else{
        this.sharedService.updateData(this.dockerForm.value).subscribe((response: any) => {
          this.notifications.showSuccess("Success",response.message);
          this.store.dispatch(OnboardingActions.loadDatasourceList());
        },
        (error) => {
          console.log("erroeUI",error);
          this.notifications.showError("Error",error.message);
        });
        this.datasource.getClose();
      }

     
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
