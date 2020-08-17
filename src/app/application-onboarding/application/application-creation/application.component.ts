import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { PipelineTemplate } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipelineTemplate.model';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Store } from '@ngrx/store';
import * as fromFeature from '../../store/feature.reducer';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';
import * as ApplicationActions from '../store/application.actions';
import { CloudAccount } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { Service } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/serviceModel';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less']
})
export class CreateApplicationComponent implements OnInit {

  userType = 'OES and Autopilot';                                 // It contain type of user i.e, Autopilot Only, OES Only or both.
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
  editServiceForm: Service;                                       // It is use to save edit Service form data.
  parentPage: string = null;                                      // It is use to redirect the parent page after clicking cancel.
  apploading: boolean = false;                                    // It is use to show hide loading screen.
  imageSourceData = null;                                         // It is use to store imageSource dropdown data.
  environmentUpdated = false;                                     // It is use to change status of services while environment is update in edit mode.
  dockerImageData = null;                                         // It is use to store data related to dockerImage fetched from state.
  dockerImageDropdownData = [];                                   // It is use to store dockerImage dropdown data on selection of Image Source
  dockerAccountName = '';                                         // It is use to store default docker Account name.
  userGroupData = [''];                                           // It is use to store array value of userGroups. 
  userGroupDropdownData = [];                                     // It is use to store userGroupDropdown data .

  constructor(public sharedService: SharedService,
              public store: Store<fromFeature.State>,
              public router: Router) { }

  ngOnInit() {

    // fetching data from store and check editMode mode is enable or disabled
    this.store.select(fromFeature.selectApplication).subscribe(
      (responseData) => {
        this.apploading = responseData.applicationLoading;
        this.parentPage = responseData.parentPage;
        
        //checking is editMode enabled
        if (responseData.editMode) {
          this.appData = responseData.applicationData;
          this.editMode = responseData.editMode;
          this.defineAllForms();

          if (responseData.applicationData !== null) {
            //populating createApplicationForm ################################################################
            this.createApplicationForm = new FormGroup({
              name: new FormControl(this.appData.name),
              emailId: new FormControl(this.appData.emailId),
              description: new FormControl(this.appData.description),
              imageSource: new FormControl({ value: this.appData.imageSource, disabled: true })
            });
            //populating dockerImagenamedropdown.
            if(responseData.callDockerImageDataAPI){
              this.onImageSourceSelect(this.appData.imageSource);
            }

            //populating serviceForm############################################################################
            if (this.appData.services.length !== 0) {
              this.servicesForm = new FormGroup({
                services: new FormArray([])
              });
              //populating services array
              this.appData.services.forEach((serviceArr, serviceindex) => {
                (<FormArray>this.servicesForm.get('services')).push(
                  new FormGroup({
                    serviceName: new FormControl(serviceArr.serviceName),
                    status: new FormControl(serviceArr.status),
                    pipelines: new FormArray([])
                  })
                );
                //populating pipeline array
                serviceArr.pipelines.forEach((pipelineArr, pipelineIndex) => {
                  const serviceArray = this.servicesForm.get('services') as FormArray;
                  const pipelineArray = serviceArray.at(serviceindex).get('pipelines') as FormArray;
                  pipelineArray.push(
                    new FormGroup({
                      pipelinetemplate: new FormControl({ value: pipelineArr.pipelinetemplate, disabled: true }),
                      cloudAccount: new FormControl({ value: '', disabled: true }),
                      dockerImageName: new FormControl({ value: pipelineArr.dockerImageName, disabled: true }),
                      pipelineParameters: new FormArray([])
                    })
                  )

                  //populating pipelieParameter array
                  pipelineArr.pipelineParameters.forEach(pipelineParameterArr => {
                    const pipelineParameter = pipelineArray.at(pipelineIndex).get('pipelineParameters') as FormArray;
                    pipelineParameter.push(
                      new FormGroup({
                        value: new FormControl(pipelineParameterArr.value),
                        name: new FormControl(pipelineParameterArr.name),
                        type: new FormControl(pipelineParameterArr.type)
                      })
                    );
                  })
                })
              })
              this.editServiceForm = this.servicesForm.getRawValue();
            }

            //populate environment Form#################################################################################
            if (this.appData.environments.length !== 0) {
              // clearing form first
              this.environmentForm = new FormGroup({
                environments: new FormArray([])
              });
              this.appData.environments.forEach(environmentdata => {
                (<FormArray>this.environmentForm.get('environments')).push(
                  new FormGroup({
                    key: new FormControl(environmentdata.key, Validators.required),
                    value: new FormControl(environmentdata.value),
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
              this.populateUserGroupsDropdown();
            }
          }else{
            this.defineAllForms();
          }
        } else if (this.appData === null && this.imageSourceData === null) {
          // defining all forms when not in edit mode
          this.defineAllForms();
        }
      }
    )

    // Below function is use to fetching data from state related to pipelineData
    this.store.select(fromFeature.selectApplication).subscribe(
      (response) => {
        if (response.pipelineData !== null) {
          this.pipelineExists = response.pipelineData;
        }
        // if (response.cloudAccountExist !== null) {
        //   this.cloudAccountExist = response.cloudAccountExist;
        // }
        if (response.imageSource !== null) {
          this.imageSourceData = response.imageSource;
        }
        if (response.dockerImageData !== null) {
          this.dockerImageData = response.dockerImageData;
          this.populateDockerImagenDropdown();
        }
        if (response.userGropsData !== null) {
          this.userGroupData = response.userGropsData;
        }
      }
    )
  }

  // Below function is use to define all forms exist in application On boarding component
  defineAllForms() {
    // defining reactive form approach for createApplicationForm
    if(this.userType === 'Autopilot Only'){
      // For autopilot only mode
      this.createApplicationForm = new FormGroup({
        name: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)], this.valitateApplicationName.bind(this)),
        emailId: new FormControl('',[Validators.required,Validators.email]),
        description: new FormControl('')
      });
    }else{
      // For OES only and both oes and autopilot mode.
      this.createApplicationForm = new FormGroup({
        name: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)], this.valitateApplicationName.bind(this)),
        emailId: new FormControl('',[Validators.required,Validators.email]),
        description: new FormControl(''),
        imageSource: new FormControl('',Validators.required)
      });
    }
    

    // defining reactive form for Permission Section
    this.groupPermissionForm = new FormGroup({
      userGroups: new FormArray([])
    });

    // defining reactive form for Environment Section
    this.environmentForm = new FormGroup({
      environments: new FormArray([])
    });

    // defining reactive form for Services Section
    switch(this.userType){
      case 'OES Only':
        this.servicesForm = new FormGroup({
          services: new FormArray([
            new FormGroup({
              serviceName: new FormControl('', [Validators.required,this.cannotContainSpace.bind(this)]),
              status: new FormControl('NEW'),
              pipelines: new FormArray([
                new FormGroup({
                  pipelinetemplate: new FormControl('', Validators.required),
                  cloudAccount: new FormControl(''),
                  dockerImageName: new FormControl('', Validators.required),
                  pipelineParameters: new FormArray([])
                })
              ])
            })
          ])
        });
        break;
      case 'Autopilot Only':
        this.servicesForm = new FormGroup({
          services: new FormArray([
            new FormGroup({
              serviceName: new FormControl('', [Validators.required,this.cannotContainSpace.bind(this)]),
              status: new FormControl('NEW'),
              logTemp: new FormControl(''),
              metricTemp: new FormControl('')
            })
          ])
        });
        break;
      case 'OES and Autopilot':
        this.servicesForm = new FormGroup({
          services: new FormArray([
            new FormGroup({
              serviceName: new FormControl('', [Validators.required,this.cannotContainSpace.bind(this)]),
              status: new FormControl('NEW'),
              logTemp: new FormControl(''),
              metricTemp: new FormControl(''),
              pipelines: new FormArray([
                new FormGroup({
                  pipelinetemplate: new FormControl('', Validators.required),
                  cloudAccount: new FormControl(''),
                  dockerImageName: new FormControl('', Validators.required),
                  pipelineParameters: new FormArray([])
                })
              ])
            })
          ])
        })
        break;
    }
    
  }
  
  //Below function is custom valiadator which is use to validate application name through API call, if name is not exist then it allows us to proceed.
  valitateApplicationName(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.sharedService.validateApplicationName(control.value, 'application').subscribe(
        (response) => {
          if (response['applicationExist'] === true) {
            resolve({ 'applicationExist': true });
          } else {
            resolve(null);
          }
        }
      )
    });
    return promise;
  }

  //Below function is custom valiadator which is use to validate inpute contain space or not. If input contain space then it will return error
  cannotContainSpace(control: FormControl): {[s: string]: boolean} {
    let startingValue = control.value.split('');
  if(startingValue.length > 0 && (control.value as string).indexOf(' ') >= 0){
    return {containSpace: true}
  }
  if( +startingValue[0] > -1 && startingValue.length > 0){
    return {startingFromNumber: true}
  }
  if ( !/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
    return {symbols: true};
  }
  return null;
  }

  // Below function is custom valiadator which is use to validate userGroup name is already selected or not. If already exist then it will return error
  usergroupExist(control: FormControl): {[s: string]: boolean} {
    let startingValue = control.value.split('');
    let counter = 0;
    if(startingValue.length > 0){
      this.groupPermissionForm.value.userGroups.forEach(groupName => {
        if(groupName.userGroup === control.value){
          counter++;
        }
      })
    }
    if(counter > 0){
      return {groupNameExist: true}
    }
    return null;
  }

  //Below function is use to populate docker image name dropdown 
  populateDockerImagenDropdown(){
    this.dockerImageDropdownData = [];
    this.dockerAccountName = this.dockerImageData[0].imageSource;
    this.servicesForm.value.services.forEach(() => {
      this.dockerImageDropdownData.push(this.dockerImageData[0].images);
    })
  }

   //Below function is use to populate UserGroup dropdown exist in user group section. 
   populateUserGroupsDropdown(){
    this.userGroupDropdownData = [];
    this.groupPermissionForm.value.userGroups.forEach((groupName,index) => {
      if(index<1){
        this.userGroupDropdownData.push(this.userGroupData);
      }else{
        this.userGroupDropdownData[index] = this.userGroupDropdownData[index-1].filter(el =>el !== this.groupPermissionForm.value.userGroups[index-1].userGroup);
      }
    })
  }

  // Below function is use to populate Docker Image name dropdown after selecting ImageSourceData
  onImageSourceSelect(ImageSourceValue){
    this.store.dispatch(ApplicationActions.loadDockerImageName({imageSourceName:ImageSourceValue}));
  }

  // Below function is use to populate Docker Image name dropdown after selecting DockerAccountName
  onChangeDockerAcc(event,serviceIndex){
    this.dockerImageData.forEach(imageName => {
      if(imageName.imageSource === event.target.value){
        this.dockerImageDropdownData[serviceIndex] = imageName.images;
      }
    })
  }

  //Below function is use to add more permission group
  addGroup() {
    (<FormArray>this.groupPermissionForm.get('userGroups')).push(
      new FormGroup({
        userGroup: new FormControl('',[Validators.required,this.usergroupExist.bind(this)]),
        permission: new FormControl('', Validators.required),
      })
    );
    // populating user group dropdown data
    this.populateUserGroupsDropdown();
  }

  // Below function is use to remove exist permission group 
  removeGroup(index) {
    $("[data-toggle='tooltip']").tooltip('hide');
    (<FormArray>this.groupPermissionForm.get('userGroups')).removeAt(index);
    // updating user group dropdown data
    this.populateUserGroupsDropdown();
  }

  //Below function is use to add more permission group
  addEnvironment() {
    (<FormArray>this.environmentForm.get('environments')).push(
      new FormGroup({
        key: new FormControl('', Validators.required),
        value: new FormControl(''),
      })
    );
  }

  // Below function is use to remove exist environment 
  removeEnvironment(index) {
    $("[data-toggle='tooltip']").tooltip('hide');
    (<FormArray>this.environmentForm.get('environments')).removeAt(index);
  }

  // Below function is use to change status of service on update of environment Form value
  onEnvironmentUpdate(index,key,event){
    if(this.editMode){
      if(this.appData.environments.length > index) {
        if(event.target.value !== this.appData.environments[index][key]){
          this.environmentUpdated = true;
        }
      }else {
        this.environmentUpdated = true;
      }
    }
  }

  // Below function is execute on select of pipeline type in Services Section
  onPipelineSelect(service_index: number, pipeline_parameter_index: number, selectedTemplate: string) {

    const arrayControl = this.servicesForm.get('services') as FormArray;
    const innerarrayControl = arrayControl.at(service_index).get('pipelines') as FormArray;
    const mainData = innerarrayControl.at(pipeline_parameter_index).get('pipelineParameters') as FormArray;

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
        serviceName: new FormControl('', [Validators.required,this.cannotContainSpace.bind(this)]),
        status: new FormControl('NEW'),
        pipelines: new FormArray([
          new FormGroup({
            pipelinetemplate: new FormControl('', Validators.required),
            cloudAccount: new FormControl(''),
            dockerImageName: new FormControl('', Validators.required),
            pipelineParameters: new FormArray([])
          })
        ])
      })
    );
    // Update dockerImageDropdownData array
    this.dockerImageDropdownData.push(this.dockerImageData[0].images);
  }

  //Below function is use to delete existing service fron Service Section
  deleteService(index) {
    //below's logice is for edit mode only
    if (this.editMode && this.appData !== null) {
      this.editServiceForm['services'].forEach(serviceArr => {
        if (serviceArr.serviceName === this.servicesForm.value.services[index].serviceName) {
          serviceArr.status = 'DELETE';
        }
      })
    }
    $("[data-toggle='tooltip']").tooltip('hide');
    (<FormArray>this.servicesForm.get('services')).removeAt(index);
     // Update dockerImageDropdownData array
     this.dockerImageDropdownData.splice(index, 1);
  }

  //Below function is execute on change of cloudAccount array .
  // CloudAccountConfigure(service_index: number, pipeline_parameter_index: number, selectedCloudAccount: string) {
  //   let CloudData = null;
  //   for (const cloudAccountArr in this.cloudAccountExist) {
  //     if (this.cloudAccountExist[cloudAccountArr].name === selectedCloudAccount) {
  //       CloudData = this.cloudAccountExist[cloudAccountArr];
  //     }
  //   }
  //   return CloudData;
  // }

  //below function is use to make field readonly when form is in edit mode
  isReadonly(index) {
    let result: boolean = null;
    if (this.editMode === true && this.appData !== null) {
      this.appData.services.forEach(servicArr => {
        if (servicArr.serviceName === this.servicesForm.value.services[index].serviceName && (this.servicesForm.value.services[index].status === 'ACTIVE' || this.servicesForm.value.services[index].status === 'UPDATE')) {
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

  // Below functon is use to change the service status in editmode
  onChangeValue(serviceIndex, pipelineIndex, pipelineTemplateIndex,event){
    const serviceInfo = this.servicesForm.value.services[serviceIndex];
    if( serviceInfo.status === 'ACTIVE' && this.editMode){
      if(event.target.value !== this.getProperValue(serviceIndex, pipelineIndex, pipelineTemplateIndex)){
        this.servicesForm.value.services[serviceIndex].status = 'UPDATE';
      }
    }
  }

  // Below function is execute after click on add template btn.
  onAddTemplate(){
    $("[data-toggle='tooltip']").tooltip('hide');
  }

  //Below function is use to fetch proper value from pipelineExist array and return in result in string format. i.e, related to pipeline templateParameter section
  getProperValue(serviceIndex, pipelineIndex, pipelineTemplateIndex) {
    const pipelineServiceName = this.servicesForm.value.services[serviceIndex].pipelines[pipelineIndex].pipelinetemplate;
    let placeholder = ''
    for (const key in this.pipelineExists) {
      if (this.pipelineExists[key].name === pipelineServiceName) {
        placeholder = this.pipelineExists[key].variables[pipelineTemplateIndex].defaultValue;
        return placeholder;
      }
    }
    return placeholder
  }

  // Below function is use to redirect to parent page after click on cancel btn
  cancelForm(){
    if(this.editMode){
      this.createApplicationForm.reset();
      this.environmentForm.reset();
      this.servicesForm.reset();
      this.groupPermissionForm.reset();
    }
    this.router.navigate([this.parentPage]);
  }

  //Below function is use to submit whole form and send request to backend
  SubmitForm() {
    debugger
    // Execute when user editing application data 
    //########### EDIT APPLICATION MODE ############
    //##############################################

    if (this.editMode) {
      const existServiceLength = this.editServiceForm['services'].length;
      let serviceFormValidation = null;
      // Below logic check whether newely added service is valid or not
      this.servicesForm.value.services.forEach((serviceArr, serviceIndex) => {
        let new_ServiceCounter = 0;
        if (serviceArr.status === 'NEW') {
          const arrayControl = this.servicesForm.get('services') as FormArray;
          const innerarrayControl = arrayControl.at(serviceIndex)
          innerarrayControl.markAllAsTouched();
          serviceFormValidation = innerarrayControl.valid;
          new_ServiceCounter++;
        }else if (serviceArr.status === 'ACTIVE' || serviceArr.status === 'UPDATE'){
          if(new_ServiceCounter === 0){
            serviceFormValidation = true;
          }
        }
      })
      
      if (serviceFormValidation && this.environmentForm.valid && this.groupPermissionForm.valid) {
        // Saving all 4 forms data into one
        //#############CreateApplicationForm###############
        this.mainForm = this.createApplicationForm.getRawValue();

        // Below configuration related to service form
        this.servicesForm.value.services.forEach((serviceArr, serviceIndex) => {
          if (serviceArr.status === 'NEW') {
            let counter = 0;
            this.editServiceForm['services'].forEach((el,index) => {
              if(el.serviceName === serviceArr.serviceName){
                counter++;
              }
            })
            if(counter === 0){
              this.editServiceForm['services'].push(this.servicesForm.value.services[serviceIndex]);
            }
          }else if (serviceArr.status === 'UPDATE') {
            this.editServiceForm['services'].forEach((el,index) => {
              if(el.serviceName === serviceArr.serviceName){
                this.editServiceForm['services'][index] = this.servicesForm.value.services[serviceIndex];
              }
            })
          }
        })
        let delete_counter = 0;
        this.editServiceForm['services'].forEach((ServiceArr, i) => {
          if(ServiceArr.status === 'DELETE'){
            delete_counter++;
            ServiceArr.pipelines.forEach((PipelineArr, j) => {
              // if (typeof (PipelineArr.cloudAccount) === 'string') {
              //   PipelineArr.cloudAccount = this.CloudAccountConfigure(i,j, PipelineArr.cloudAccount);
              // }
              PipelineArr.cloudAccount = {
                "name": "",
                "type": "",
                "providerVersion": ""
              }
            })
          }else{
            ServiceArr.pipelines.forEach((PipelineArr, j) => {
              // if (typeof (PipelineArr.cloudAccount) === 'string') {
              //   PipelineArr.cloudAccount = this.CloudAccountConfigure((delete_counter > 0?i-1:i), j, PipelineArr.cloudAccount);
              // }
              PipelineArr.cloudAccount = {
                "name": "",
                "type": "",
                "providerVersion": ""
              }
              PipelineArr.pipelineParameters.forEach((DataArr, k) => {
                  if (DataArr.value === '') {
                    DataArr.value = this.getProperValue((delete_counter > 0?i-1:i), j, k)
                  }
              })
            })
          }
        })
        //#############ServiceFormSection###################
        this.mainForm.services = this.editServiceForm['services'];
        //#############EnvironmentFormSection###############
        // when environment is updated make all service status as UPDATE
        if(this.environmentUpdated){
          this.mainForm.services.forEach(el => {
            if(el.status === 'ACTIVE') {
              el.status = 'UPDATE';
            }
          })
        }
        this.mainForm.environments = this.environmentForm.value.environments;
        //#############GroupPermissionSection###############
        this.mainForm.userGroups = this.groupPermissionForm.value.userGroups;

        //Below function is checking user updated the form or not
        let formUpdated = false;
        this.mainForm.services.forEach(el => {
          if(el.status !== "ACTIVE"){
            formUpdated = true;
          }
        })

        //Below action is use to save updated application form in database
        if(formUpdated){
          this.store.dispatch(ApplicationActions.updateApplication({appData:this.mainForm}));
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html:
                '<h5>None of the application parameter is edited !!</h5>' +
                '<p style="font-size: small;">Please edit the application parameters to proceed further.</p>',
          })
        }
        
      } else {
        this.environmentForm.markAllAsTouched();
        this.groupPermissionForm.markAllAsTouched();
      }
    }
    // Execute when user creating application data. 
    //############# CREATE APPLICATION MODE ###############
    //#####################################################
    else {
      if (this.createApplicationForm.valid && this.servicesForm && this.environmentForm.valid && this.groupPermissionForm.valid) {

        // Saving all 4 forms data into one
        this.mainForm = this.createApplicationForm.value;
        // Below is configuration related to service section when userType contain OES.
        if(this.userType.includes('OES')){
          this.servicesForm.value.services.forEach((ServiceArr, i) => {
            ServiceArr.pipelines.forEach((PipelineArr, j) => {
              // if (typeof (PipelineArr.cloudAccount) === 'string') {
              //   PipelineArr.cloudAccount = this.CloudAccountConfigure(i, j, PipelineArr.cloudAccount);
              // }
              // below code is removed in future when clound account implements
              PipelineArr.cloudAccount = {
                "name": "",
                "type": "",
                "providerVersion": ""
              }
              PipelineArr.pipelineParameters.forEach((DataArr, k) => {
                if (DataArr.value === '') {
                  DataArr.value = this.getProperValue(i, j, k)
                }
              })
            })
          })
        }
        
        this.mainForm.services = this.servicesForm.value.services;
        this.mainForm.userGroups = this.groupPermissionForm.value.userGroups;
        if(this.userType.includes('OES')){
          this.mainForm.environments = this.environmentForm.value.environments;
        }
        
        //Below action is use to save created form in database
        this.store.dispatch(ApplicationActions.createApplication({appData:this.mainForm}));
      } else {
        this.validForms();
      }
    }

  }
}
