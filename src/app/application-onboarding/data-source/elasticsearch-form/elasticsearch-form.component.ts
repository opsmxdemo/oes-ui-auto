import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';
import {DataSourceComponent} from 'src/app/application-onboarding/data-source/data-source.component';
import { Store } from '@ngrx/store';
import * as fromFeature from '../../store/feature.reducer';
import * as DataSourceActions from '../store/data-source.actions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-elasticsearch-form',
  templateUrl: './elasticsearch-form.component.html',
  styleUrls: ['./elasticsearch-form.component.less']
})
export class ElasticsearchFormComponent implements OnInit {

  elasticForm: FormGroup;
  submitted = false;
  form_type: string;
  
  constructor(private formBuilder: FormBuilder,private sharedService: SharedService,
    private notifications: NotificationService, private datasource: DataSourceComponent,
    public store: Store<fromFeature.State>,
              public router: Router) { }

  ngOnInit(): void {
    this.elasticForm = this.formBuilder.group({
      account_type: ['Elastic Search'],
      endpoint: ['asdfasdf', Validators.required,this.validateDatasourceName.bind(this)],
      username: ['ssssdf', Validators.required],
      password: ['', Validators.required]
    });
   // this.form_type = 'new';
    this.form_type= this.sharedService.dataSourceType;
    if(this.sharedService.getDataSourceType() === 'edit'){
      this.elasticForm = this.formBuilder.group({
        account_type: ['Elastic Search'],
        name: ['', Validators.required],
        endPoint: [''],
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
      //this.form_type = 'edit';
      this.elasticForm.patchValue({
        name: this.sharedService.getDataSourceData().name,
        username: this.sharedService.getDataSourceData().username,
        password: this.sharedService.getDataSourceData().password
       });
    }else{
      this.form_type= this.sharedService.dataSourceType;
      this.elasticForm.patchValue({
        name: '',
        username: '',
        password: ''
       });
    }
   
  }

    // convenience getter for easy access to form fields
    get df() { return this.elasticForm.controls; }

    onSubmit() {
      this.submitted = true;
        // stop here if form is invalid
      if (this.elasticForm.invalid) {
          return;
      }

      if(this.form_type === 'new'){
        this.sharedService.saveData(this.elasticForm.value).subscribe((response: any) => {
          this.notifications.showSuccess("Success",response.message);
          this.store.dispatch(DataSourceActions.loadDatasourceList());
        },
        (error) => {
          console.log("erroeUI",error);
          this.notifications.showError("Error",error.message);
        });
        this.datasource.getClose();
      }else{
        this.sharedService.updateData(this.elasticForm.value).subscribe((response: any) => {
          this.notifications.showSuccess("Success",response.message);
          this.store.dispatch(DataSourceActions.loadDatasourceList());
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
      this.elasticForm.reset();
  }

}
