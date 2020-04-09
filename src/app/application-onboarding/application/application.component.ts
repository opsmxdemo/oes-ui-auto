import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { PipelineTemplate } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipelineTemplate.model';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less']
})
export class ApplicationComponent implements OnInit {

  createApplicationForm: FormGroup;                               // For Application Section
  groupPermissionForm: FormGroup;                                 // For Permission Section
  servicesForm: FormGroup;                                        // For Services Section
  fetchedPipelineTemplateParameters: PipelineTemplate[];          // For fetched pipeline_parameter through api used in serviceForm
  pipelineExists: Pipeline;                                       // For populating the pipeline Type dropdown exist in services section.
  environmentExists=[ {id:1,value:'Stage'},                       // For populating the Environment dropdown exist in each pipeline
                      {id:2,value:'Prod'},
                      {id:3,value:'Dev'}
                    ];
  mainForm:CreateApplication=null;                                // It contain data of all 3 forms which send to backend after successful submission.

  constructor(public sharedService: SharedService,
              public store:Store<fromApp.AppState>) { }

  ngOnInit() {

    // defining reactive form approach for createApplicationForm
    this.createApplicationForm = new FormGroup({
      name: new FormControl('', Validators.required, this.valitateApplicationName.bind(this)),
      description: new FormControl('')
    });

    // defining reactive form for Permission Section
    this.groupPermissionForm = new FormGroup({
      userGroups: new FormArray([])
    });

    // defining reactive form for Services Section
    this.servicesForm = new FormGroup({
      services: new FormArray([
        new FormGroup({
          serviceName: new FormControl('', Validators.required),
          environment: new FormControl(''),
          pipeline: new FormArray([
            new FormGroup({
              pipelineType: new FormControl('', Validators.required),
              pipelineParameter: new FormArray([])
            })
          ])
        })
      ])
    })

    // Below function is use to fetching data from state related to pipelineData
    this.store.select('appOnboarding').subscribe(
      (response) => {
        if(response.pipelineData !== null){
          this.pipelineExists = response.pipelineData['pipelineExist'];
        }
        
      }
    )

  }

  //Below function is custom valiadator which is use to validate application name through API call, if name is not exist then it allows us to proceed.
  valitateApplicationName(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {

      this.sharedService.validateApplicationName(control.value, 'application').subscribe(
        (response) => {
          if (response['nameExist'] === true) {
            resolve({ 'nameMatches': true });
          } else {
            resolve(null);
          }
        }
      )
    });
    return promise;
  }

  //Below function is use to add more permission group
  addGroup() {
    (<FormArray>this.groupPermissionForm.get('userGroups')).push(
      new FormGroup({
        userGroup: new FormControl('', Validators.required),
        permission: new FormControl('', Validators.required),
      })
    );
  }

  // Below function is use to remove exist permission group
  removeGroup(index) {
    (<FormArray>this.groupPermissionForm.get('userGroups')).removeAt(index);
  }

  // Below function is execute on select of pipeline type in Services Section
  onPipelineSelect(service_index: number, pipeline_parameter_index: number) {
    const arrayControl = this.servicesForm.get('services') as FormArray;
    const innerarrayControl = arrayControl.at(service_index).get('pipeline') as FormArray;
    const mainData = innerarrayControl.at(pipeline_parameter_index).get('pipelineParameter') as FormArray;

    // Fetching pipeline parameters fron service and pushed it in service form in appropriate position
    this.sharedService.getPipelineParameters().subscribe(
      (response) => {
        if (response !== undefined) {
          this.fetchedPipelineTemplateParameters = response['templateData'];
          this.fetchedPipelineTemplateParameters.forEach(element => {
            mainData.push(
              new FormGroup({
                value: new FormControl(element.value, Validators.required),
                label: new FormControl(element.label, Validators.required)
              })
            );
          });
        }
      }
    )
  }

  //Below function is use to add new service in existing Service Section
  addService(){
    (<FormArray>this.servicesForm.get('services')).push(
      new FormGroup({
        serviceName: new FormControl('', Validators.required),
        environment: new FormControl(''),
        pipeline: new FormArray([
          new FormGroup({
            pipelineType: new FormControl('', Validators.required),
            pipelineParameter: new FormArray([])
          })
        ])
      })
    );
  }

  //Below function is use to delete existing service fron Service Section
  deleteService(index){
    (<FormArray>this.servicesForm.get('services')).removeAt(index);
  }

  //Below function is use to submit whole form and send request to backend
  SubmitForm(){
    if(this.createApplicationForm.valid && this.servicesForm && this.groupPermissionForm.valid){
      
      // Saving all 3 forms data into one
      this.mainForm = this.createApplicationForm.value;
      this.mainForm.services = this.servicesForm.value.services;
      this.mainForm.userGroups = this.groupPermissionForm.value.userGroups;

     
      console.log("mainform",JSON.stringify(this.mainForm));
      
    }else{
      this.createApplicationForm.markAllAsTouched();
      this.servicesForm.markAllAsTouched();
      this.groupPermissionForm.markAllAsTouched();
    }
  }

}
