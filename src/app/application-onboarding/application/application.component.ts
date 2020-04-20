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
import { CloudAccount } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { Service } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/serviceModel';

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
  cloudAccountExist: CloudAccount;                                // It contain data of all cloud Account exist.  
  editMode: boolean = false                                       // It use to define form is in edit phase
  appData: CreateApplication = null;                              // It use to hold application fetch from api.                                         
  editServiceForm: Service;                                       // It is use to save edit Service form data

  constructor(public sharedService: SharedService,
    public store: Store<fromApp.AppState>) { }

  ngOnInit() {

    // fetching data from store and check editMode mode is enable or disabled
    this.store.select('appOnboarding').subscribe(
      (responseData) => {
        //checking is editMode enabled
        if (responseData.editMode) {
          this.appData = responseData.applicationData;
          this.editMode = responseData.editMode;
          // this.defineAllForms();

          if (responseData.applicationData !== null) {
            //populating createApplicationForm ################################################################
            this.createApplicationForm = new FormGroup({
              name: new FormControl(this.appData.name, Validators.required, this.valitateApplicationName.bind(this)),
              description: new FormControl(this.appData.description)
            });

            //populating serviceForm############################################################################
            if (this.appData.services.length !== 0) {
              this.servicesForm = new FormGroup({
                services: new FormArray([])
              });
              //populating services array
              this.appData.services.forEach((serviceArr, serviceindex) => {
                (<FormArray>this.servicesForm.get('services')).push(
                  new FormGroup({
                    serviceName: new FormControl(serviceArr.serviceName, Validators.required),
                    status: new FormControl(serviceArr.status),
                    pipeline: new FormArray([])
                  })
                );
                //populating pipeline array
                serviceArr.pipeline.forEach((pipelineArr, pipelineIndex) => {
                  const serviceArray = this.servicesForm.get('services') as FormArray;
                  const pipelineArray = serviceArray.at(serviceindex).get('pipeline') as FormArray;
                  pipelineArray.push(
                    new FormGroup({
                      pipelinetemplate: new FormControl({ value: pipelineArr.pipelinetemplate, disabled: true }),
                      cloudAccount: new FormControl({ value: pipelineArr.cloudAccount.name, disabled: true }),
                      dockerImageName: new FormControl({ value: pipelineArr.dockerImageName, disabled: true }),
                      pipelineParameter: new FormArray([])
                    })
                  )

                  //populating pipelieParameter array
                  pipelineArr.pipelineParameter.forEach(pipelineParameterArr => {
                    const pipelineParameter = pipelineArray.at(pipelineIndex).get('pipelineParameter') as FormArray;
                    pipelineParameter.push(
                      new FormGroup({
                        value: new FormControl({ value: pipelineParameterArr.value, disabled: true }),
                        name: new FormControl({ value: pipelineParameterArr.name, disabled: false }),
                        type: new FormControl({ value: pipelineParameterArr.type, disabled: false })
                      })
                    );
                  })
                })
              })
              this.editServiceForm = this.servicesForm.getRawValue();
            }

            //populate environment Form#################################################################################
            if (this.appData.environment.length !== 0) {
              // clearing form first
              this.environmentForm = new FormGroup({
                environments: new FormArray([])
              });
              this.appData.environment.forEach(environmentdata => {
                (<FormArray>this.environmentForm.get('environments')).push(
                  new FormGroup({
                    key: new FormControl(environmentdata.key, Validators.required),
                    value: new FormControl(environmentdata.value, Validators.required),
                  })
                );
              })
            }

            //populate groupPermission Form #############################################################################
            if (this.appData.userGroups.length !== 0) {
              // clearing form first
              this.groupPermissionForm = new FormGroup({
                userGroups: new FormArray([])
              });
              this.appData.userGroups.forEach(groupData => {
                (<FormArray>this.groupPermissionForm.get('userGroups')).push(
                  new FormGroup({
                    userGroup: new FormControl(groupData.userGroup, Validators.required),
                    permission: new FormControl(groupData.permission, Validators.required),
                  })
                );
              })
            }
          }
        } else if (this.appData === null) {
          // defining all forms when not in edit mode
          this.defineAllForms();
        }
      }
    )

    // Below function is use to fetching data from state related to pipelineData
    this.store.select('appOnboarding').subscribe(
      (response) => {
        if (response.pipelineData !== null) {
          this.pipelineExists = response.pipelineData;
        }
        if (response.cloudAccountExist !== null) {
          this.cloudAccountExist = response.cloudAccountExist;
        }
      }
    )
    //for testing purpose pipelineExist
    //this.store.dispatch(OnboardingActions.enableEditMode({ editMode: true, applicationName: 'TestApplication' }));
    this.store.dispatch(OnboardingActions.loadApp());
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
          status: new FormControl('New'),
          pipeline: new FormArray([
            new FormGroup({
              pipelinetemplate: new FormControl('', Validators.required),
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
  onPipelineSelect(service_index: number, pipeline_parameter_index: number, selectedTemplate: string) {

    const arrayControl = this.servicesForm.get('services') as FormArray;
    const innerarrayControl = arrayControl.at(service_index).get('pipeline') as FormArray;
    const mainData = innerarrayControl.at(pipeline_parameter_index).get('pipelineParameter') as FormArray;

    //clearing existing element of array
    mainData.clear();

    // Fetching pipeline parameters from pipelineExist object and place it in appropriate position
    for (const key in this.pipelineExists) {
      if (this.pipelineExists[key].name === selectedTemplate) {
        this.pipelineExists[key].variables.forEach(templateData => {
          mainData.push(
            new FormGroup({
              value: new FormControl(''),
              name: new FormControl(templateData.name),
              type: new FormControl(templateData.type)
            })
          );
        });
      }
    }
  }

  //Below function is use to add new service in existing Service Section
  addService() {
    (<FormArray>this.servicesForm.get('services')).push(
      new FormGroup({
        serviceName: new FormControl('', Validators.required),
        status: new FormControl('New'),
        pipeline: new FormArray([
          new FormGroup({
            pipelinetemplate: new FormControl('', Validators.required),
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
    //below's logice is for edit mode only
    if (this.editMode && this.appData !== null) {
      this.editServiceForm['services'].forEach(serviceArr => {
        if (serviceArr.serviceName === this.servicesForm.value.services[index].serviceName) {
          serviceArr.status = 'Delete';
        }
      })
    }
    (<FormArray>this.servicesForm.get('services')).removeAt(index);
  }

  //Below function is execute on change of cloudAccount array .
  CloudAccountConfigure(service_index: number, pipeline_parameter_index: number, selectedCloudAccount: string) {
    let CloudData = null;
    for (const cloudAccountArr in this.cloudAccountExist) {
      if (this.cloudAccountExist[cloudAccountArr].name === selectedCloudAccount) {
        CloudData = this.cloudAccountExist[cloudAccountArr];
      }
    }
    return CloudData;
  }

  //below function is use to make field readonly when form is in edit mode
  isReadonly(index) {
    let result: boolean = null;
    if (this.editMode === true && this.appData !== null) {
      this.appData.services.forEach(servicArr => {
        if (servicArr.serviceName === this.servicesForm.value.services[index].serviceName) {
          result = true;
          return result;
        }
      })
    } else {
      result = false;
      return result;
    }
    return result;
  }

  //valid all form data if something is left
  validForms() {
    // displaying error on reqd field which is invalid
    this.createApplicationForm.markAllAsTouched();
    this.servicesForm.markAllAsTouched();
    this.environmentForm.markAllAsTouched();
    this.groupPermissionForm.markAllAsTouched();
  }

  //Below function is use to fetch proper value from pipelineExist array and return in result in string format. i.e, related to pipeline templateParameter section
  getProperValue(serviceIndex, pipelineIndex, pipelineTemplateIndex) {

    const pipelineServiceName = this.servicesForm.value.services[serviceIndex].pipeline[pipelineIndex].pipelinetemplate;
    let placeholder = ''
    for (const key in this.pipelineExists) {
      if (this.pipelineExists[key].name === pipelineServiceName) {
        placeholder = this.pipelineExists[key].variables[pipelineTemplateIndex].defaultValue;
        return placeholder;
      }
    }
    return placeholder
  }

  //Below function is use to submit whole form and send request to backend
  SubmitForm() {
    // Execute when user editing application data
    if (this.editMode) {
      if (this.createApplicationForm.valid && this.servicesForm && this.environmentForm.valid && this.groupPermissionForm.valid) {
        // Saving all 4 forms data into one
        //#############CreateApplicationForm###############
        this.mainForm = this.createApplicationForm.value;

        // Below configuration related to service form
        this.servicesForm.value.services.forEach((serviceArr, serviceIndex) => {
          if (serviceArr.status === 'New') {
            this.editServiceForm['services'].push(this.servicesForm.value.services[serviceIndex]);
          }
        })
        this.editServiceForm['services'].forEach((ServiceArr, i) => {
          ServiceArr.pipeline.forEach((PipelineArr, j) => {
            if (typeof (PipelineArr.cloudAccount) === 'string') {
              PipelineArr.cloudAccount = this.CloudAccountConfigure(i, j, PipelineArr.cloudAccount);
            }
            PipelineArr.pipelineParameter.forEach((DataArr, k) => {
              if (DataArr.value === '') {
                DataArr.value = this.getProperValue(i, j, k)
              }
            })
          })
        })
        //#############ServiceFormSection###################
        this.mainForm.services = this.editServiceForm['services'];
        //#############EnvironmentFormSection###############
        this.mainForm.environment = this.environmentForm.value.environments;
        //#############GroupPermissionSection###############
        this.mainForm.userGroups = this.groupPermissionForm.value.userGroups;

        console.log("editform", JSON.stringify(this.mainForm));
      } else {
        this.validForms();
      }
    }
    // Execute when user creating application data.
    else {
      if (this.createApplicationForm.valid && this.servicesForm && this.environmentForm.valid && this.groupPermissionForm.valid) {

        // Saving all 4 forms data into one
        this.mainForm = this.createApplicationForm.value;
        // Below is configuration related to service section
        this.servicesForm.value.services.forEach((ServiceArr, i) => {
          ServiceArr.pipeline.forEach((PipelineArr, j) => {
            if (typeof (PipelineArr.cloudAccount) === 'string') {
              PipelineArr.cloudAccount = this.CloudAccountConfigure(i, j, PipelineArr.cloudAccount);
            }
            PipelineArr.pipelineParameter.forEach((DataArr, k) => {
              if (DataArr.value === '') {
                DataArr.value = this.getProperValue(i, j, k)
              }
            })
          })
        })
        this.mainForm.services = this.servicesForm.value.services;
        this.mainForm.environment = this.environmentForm.value.environments;
        this.mainForm.userGroups = this.groupPermissionForm.value.userGroups;
        console.log("mainform", JSON.stringify(this.mainForm));
      } else {
        this.validForms();
      }
    }

  }
}
