import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { PipelineTemplate } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipelineTemplate.model';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';
import * as OnboardingActions from '../store/onBoarding.actions';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less']
})
export class ApplicationComponent implements OnInit {

  createApplicationForm: FormGroup;                               // For Application Section
  groupPermissionForm: FormGroup;                                 // For Permission Section
  servicesForm: FormGroup;                                        // For Services Section
  environmentForm: FormGroup;                                     // For Environment Section
  fetchedPipelineTemplateParameters: PipelineTemplate[];          // For fetched pipeline_parameter through api used in serviceForm
  pipelineExists: Pipeline;                                       // For populating the pipeline Type dropdown exist in services section.
  mainForm: CreateApplication = null;                             // It contain data of all 3 forms which send to backend after successful submission.

  constructor(public sharedService: SharedService,
    public store: Store<fromApp.AppState>) { }

  ngOnInit() {

    // fetching data from store and check editMode mode is enable or disabled
    this.store.select('appOnboarding').subscribe(
      (responseData) => {
        //checking is editMode enabled
        if (responseData.editMode) {
          const appData = responseData.applicationData;
          // this.defineAllForms();

          if (responseData.applicationData !== null) {
            //populating createApplicationForm ################################################################
            this.createApplicationForm = new FormGroup({
              name: new FormControl(appData.name, Validators.required, this.valitateApplicationName.bind(this)),
              description: new FormControl(appData.description)
            });

            //populating serviceForm############################################################################
            this.servicesForm = new FormGroup({
              services: new FormArray([])
            });
            //populating services array
            appData.services.forEach((serviceArr, serviceindex) => {
              (<FormArray>this.servicesForm.get('services')).push(
                new FormGroup({
                  serviceName: new FormControl(serviceArr.serviceName, Validators.required),
                  pipeline: new FormArray([])
                })
              );
              //populating pipeline array
              serviceArr.pipeline.forEach((pipelineArr, pipelineIndex) => {
                const serviceArray = this.servicesForm.get('services') as FormArray;
                const pipelineArray = serviceArray.at(serviceindex).get('pipeline') as FormArray;
                pipelineArray.push(
                  new FormGroup({
                    pipelineType: new FormControl(pipelineArr.pipelineType, Validators.required),
                    pipelineParameter: new FormArray([])
                  })
                )

                //populating pipelieParameter array
                pipelineArr.pipelineParameter.forEach(pipelineParameterArr => {
                  const pipelineParameter = pipelineArray.at(pipelineIndex).get('pipelineParameter') as FormArray;
                  pipelineParameter.push(
                    new FormGroup({
                      value: new FormControl(pipelineParameterArr.value, Validators.required),
                      label: new FormControl(pipelineParameterArr.label, Validators.required)
                    })
                  );
                })
              })
            })

            //populate environment Form#################################################################################
            appData.environment.forEach(environmentdata => {
              (<FormArray>this.environmentForm.get('environments')).push(
                new FormGroup({
                  key: new FormControl(environmentdata.key, Validators.required),
                  value: new FormControl(environmentdata.value, Validators.required),
                })
              );
            })

            //populate groupPermission Form #############################################################################
            appData.userGroups.forEach(groupData => {
              (<FormArray>this.groupPermissionForm.get('userGroups')).push(
                new FormGroup({
                  userGroup: new FormControl(groupData.userGroup, Validators.required),
                  permission: new FormControl(groupData.permission, Validators.required),
                })
              );
            })
          }
        } else {
          // defining all forms when not in edit mode
          this.defineAllForms();
        }
      }
    )

    // Below function is use to fetching data from state related to pipelineData
    this.store.select('appOnboarding').subscribe(
      (response) => {
        if (response.pipelineData !== null) {
          this.pipelineExists = response.pipelineData['pipelineExist'];
        }

      }
    )
    //for testing purpose pipelineExist
    //this.store.dispatch(OnboardingActions.enableEditMode({ editMode: true, applicationName: 'TestApplication' }));
  }

  // Below function is use to define all forms exist in application On boarding component
  defineAllForms() {
    // defining reactive form approach for createApplicationForm
    this.createApplicationForm = new FormGroup({
      name: new FormControl('', Validators.required, this.valitateApplicationName.bind(this)),
      description: new FormControl('')
    });

    // defining reactive form for Permission Section
    this.groupPermissionForm = new FormGroup({
      userGroups: new FormArray([])
    });

    // defining reactive form for Environment Section
    this.environmentForm = new FormGroup({
      environments: new FormArray([])
    });

    // defining reactive form for Services Section
    this.servicesForm = new FormGroup({
      services: new FormArray([
        new FormGroup({
          serviceName: new FormControl('', Validators.required),
          pipeline: new FormArray([
            new FormGroup({
              pipelineType: new FormControl('', Validators.required),
              cloudAccount: new FormControl('', Validators.required),
              dockerImageName: new FormControl('', Validators.required),
              pipelineParameter: new FormArray([])
            })
          ])
        })
      ])
    })
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

  //Below function is use to add more permission group
  addEnvironment() {
    (<FormArray>this.environmentForm.get('environments')).push(
      new FormGroup({
        key: new FormControl('', Validators.required),
        value: new FormControl('', Validators.required),
      })
    );
  }

  // Below function is use to remove exist environment 
  removeEnvironment(index) {
    (<FormArray>this.environmentForm.get('environments')).removeAt(index);
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
  addService() {
    (<FormArray>this.servicesForm.get('services')).push(
      new FormGroup({
        serviceName: new FormControl('', Validators.required),
        pipeline: new FormArray([
          new FormGroup({
            pipelineType: new FormControl('', Validators.required),
            cloudAccount: new FormControl('', Validators.required),
            dockerImageName: new FormControl('', Validators.required),
            pipelineParameter: new FormArray([])
          })
        ])
      })
    );
  }

  //Below function is use to delete existing service fron Service Section
  deleteService(index) {
    (<FormArray>this.servicesForm.get('services')).removeAt(index);
  }

  //Below function is use to submit whole form and send request to backend
  SubmitForm() {
    debugger
    if (this.createApplicationForm.valid && this.servicesForm && this.environmentForm.valid && this.groupPermissionForm.valid) {
      
      // Saving all 3 forms data into one
      this.mainForm = this.createApplicationForm.value;
      this.mainForm.services = this.servicesForm.value.services;
      this.mainForm.environment = this.environmentForm.value.environments;
      this.mainForm.userGroups = this.groupPermissionForm.value.userGroups;
      console.log("mainform", JSON.stringify(this.mainForm));
    } else {

      // displaying error on reqd field which is invalid
      this.createApplicationForm.markAllAsTouched();
      this.servicesForm.markAllAsTouched();
      this.environmentForm.markAllAsTouched();
      this.groupPermissionForm.markAllAsTouched();
    }
  }

}
