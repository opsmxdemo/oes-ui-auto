import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { PipelineTemplate } from '../../../models/applicationOnboarding/pipelineTemplate/pipelineTemplate.model';
import { Pipeline } from '../../../models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Store } from '@ngrx/store';
import * as fromFeature from '../../store/feature.reducer';
import * as fromApp from '../../../store/app.reducer';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';
import * as ApplicationActions from '../store/application.actions';
import { CloudAccount } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { Service } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/serviceModel';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { GroupPermission } from 'src/app/models/applicationOnboarding/createApplicationModel/groupPermissionModel/groupPermission.model';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less']
})
export class CreateApplicationComponent implements OnInit {

  @ViewChild('logModel') logModel: ElementRef;
  @ViewChild('metricModel') metricModel: ElementRef;

  userType = 'OES-AP';                                            // It contain type of user i.e, AP, OES or both.
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
  userGroupData = [];                                             // It is use to store array value of userGroups. 
  userGroupDropdownData = [];                                     // It is use to store userGroupDropdown data .
  logTemplateData = [];                                           // It is use to store log Template data created from json editor.
  metricTemplateData = [];                                        // It is use to store metric Template data created from json editor.
  currentLogTemplateIndex = -1;                                   // It is use to store index value of current service where user is creating log template.
  currentMetricTemplateIndex = -1;                                // It is use to store index value of current service where user is creating Metric template.
  userGroupPermissions:Object[] = [];                             // It is use to store value of checkbox need to display in group section.
  editApplicationCounter:number = 0;                              // It is use to restrict reexecuting of edit application method.
  
  constructor(public sharedService: SharedService,
              public store: Store<fromFeature.State>,
              public appStore: Store<fromApp.AppState>,
              public router: Router) { }

  ngOnInit() {

    // Reseting metric and log Templates data
    this.store.dispatch(ApplicationActions.resetTemplateData());

    // Below function is use to fetch data from AppState to update usertype
    this.appStore.select('layout').subscribe(
      (layoutRes) => {
        if(layoutRes.installationMode !== ''){
          this.userType = layoutRes.installationMode;
        }
      }
    )

    // fetching data from store and check editMode mode is enable or disabled
    this.store.select(fromFeature.selectApplication).subscribe(
      (responseData) => {
        this.apploading = responseData.applicationLoading;
        this.parentPage = responseData.parentPage;
        
        //checking is editMode enabled
        if (responseData.editMode && this.editApplicationCounter === 0) {
          
          this.appData = responseData.applicationData;
          this.editMode = responseData.editMode;
          this.defineAllForms();

          if (responseData.applicationData !== null) {
            this.editApplicationCounter++;
            // Reseting metric and log Templates data
            this.store.dispatch(ApplicationActions.resetTemplateData());
            //populating createApplicationForm ################################################################
            if(this.userType === 'AP'){
              // AP mode
              this.createApplicationForm = new FormGroup({
                name: new FormControl(this.appData.name),
                emailId: new FormControl(this.appData.emailId, [Validators.required,Validators.email]),
                description: new FormControl(this.appData.description),
                lastUpdatedTimestamp: new FormControl(this.appData.lastUpdatedTimestamp)
              });
            }else{
              // user belongs to OES mode also.
              this.createApplicationForm = new FormGroup({
                name: new FormControl(this.appData.name),
                emailId: new FormControl(this.appData.emailId, [Validators.required,Validators.email]),
                description: new FormControl(this.appData.description),
                imageSource: new FormControl(this.appData.imageSource, Validators.required),
                lastUpdatedTimestamp: new FormControl(this.appData.lastUpdatedTimestamp)
              });
              //populating dockerImagenamedropdown.
              if(responseData.callDockerImageDataAPI){
                this.onImageSourceSelect(this.appData.imageSource);
              }
            }
            

            //populating serviceForm ############################################################################
            if (this.appData.services.length !== 0) {
              this.servicesForm = new FormGroup({
                services: new FormArray([])
              });
              switch(this.userType){
                case 'OES':
                case 'OES-AP':
                  //populating services array in OES mode
                  this.appData.services.forEach((serviceArr, serviceindex) => {
                    if(this.userType === 'OES-AP'){
                      (<FormArray>this.servicesForm.get('services')).push(
                        new FormGroup({
                          serviceName: new FormControl(serviceArr.serviceName,[Validators.required,this.cannotContainSpace.bind(this)]),
                          id: new FormControl(serviceArr.id),
                          logTemp: new FormControl(serviceArr.logTemp),
                          metricTemp: new FormControl(serviceArr.metricTemp),
                          pipelines: new FormArray([])
                        })
                      );
                    }else{
                      (<FormArray>this.servicesForm.get('services')).push(
                        new FormGroup({
                          serviceName: new FormControl(serviceArr.serviceName,[Validators.required,this.cannotContainSpace.bind(this)]),
                          id: new FormControl(serviceArr.id),
                          pipelines: new FormArray([])
                        })
                      );
                    }
                    
                    //populating pipeline array
                    serviceArr.pipelines.forEach((pipelineArr, pipelineIndex) => {
                      const serviceArray = this.servicesForm.get('services') as FormArray;
                      const pipelineArray = serviceArray.at(serviceindex).get('pipelines') as FormArray;
                      pipelineArray.push(
                        new FormGroup({
                          pipelinetemplate: new FormControl(pipelineArr.pipelinetemplate, Validators.required),
                          dockerImageName: new FormGroup({
                            accountName: new FormControl(pipelineArr.dockerImageName.accountName, Validators.required),
                            imageName: new FormControl(pipelineArr.dockerImageName.imageName, Validators.required)
                          }),
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
                  break;
                case 'AP':
                  //populating services array in OES mode
                  this.appData.services.forEach(serviceArr => {
                    (<FormArray>this.servicesForm.get('services')).push(
                      new FormGroup({
                        serviceName: new FormControl(serviceArr.serviceName,[Validators.required,this.cannotContainSpace.bind(this)]),
                        id: new FormControl(serviceArr.id),
                        logTemp: new FormControl(serviceArr.logTemp),
                        metricTemp: new FormControl(serviceArr.metricTemp)
                      })
                    );
                  });
                  break;
              }
            }

            //populate environment Form if usertype include OES in it#################################################################################
            if (this.appData.environments.length !== 0 && this.userType !== 'AP') {
              // clearing form first
              this.environmentForm = new FormGroup({
                environments: new FormArray([])
              });
              this.appData.environments.forEach(environmentdata => {
                (<FormArray>this.environmentForm.get('environments')).push(
                  new FormGroup({
                    key: new FormControl(environmentdata.key, Validators.required),
                    value: new FormControl(environmentdata.value),
                    id: new FormControl(environmentdata.id)
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
              //populating the form
              const userGroupControl = this.groupPermissionForm.get('userGroups') as FormArray;
              this.appData.userGroups.forEach((groupData,index) => {
                // pushing controls in usergroup form.
                userGroupControl.push(
                  new FormGroup({
                    userGroupId: new FormControl(groupData.userGroupId,[Validators.required,this.usergroupExist.bind(this)]),
                    permissionIds: new FormArray([])
                  })
                );

                // pushing controls in permissionIDs
                const permissionIdGroupControl = userGroupControl.at(index).get('permissionIds') as FormArray;
                this.populatePermissions(permissionIdGroupControl,groupData.permissionIds);
              })
            }

            //populating log and metric template data ######################################################################
            if(this.userType === 'AP' || this.userType === 'OES-AP'){
              // Storing Log and Metric template data in state getting from appData
              this.appData.logTemplate.forEach(logTemp => {
                this.store.dispatch(ApplicationActions.createdLogTemplate({logTemplateData:logTemp}))
              });
              this.appData.metricTemplate.forEach(metricTemp => {
                this.store.dispatch(ApplicationActions.createdMetricTemplate({metricTemplateData:metricTemp}));
              });
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
        if (response.imageSource !== null) {
          this.imageSourceData = response.imageSource;
        }
        if (response.dockerImageData !== null && response.dockerImageData !== undefined) {
          this.dockerImageData = response.dockerImageData;
          this.populateDockerImagenDropdown();
        }
        if (response.userGropsData !== null && response.userGroupsPermissions !== null) {
          this.userGroupData = response.userGropsData;
          this.userGroupPermissions = response.userGroupsPermissions;
          // populating user group dropdown data
          this.populateUserGroupsDropdown();
        }
        if (response.logtemplate.length > 0){
          this.logTemplateData = response.logtemplate;
          if(this.logModel !== undefined){
            this.logModel.nativeElement.click();
          }
          this.populateSelectedTemplateName(this.currentLogTemplateIndex,'logTemp')
        }
        if (response.metrictemplate.length > 0){
          this.metricTemplateData = response.metrictemplate;
          if(this.metricModel !== undefined){
            this.metricModel.nativeElement.click();
          }
          this.populateSelectedTemplateName(this.currentMetricTemplateIndex,'metricTemp')
        }
      }
    )
  }

  // Below function is use to define all forms exist in application On boarding component
  defineAllForms() {
    // defining reactive form approach for createApplicationForm
    if(this.userType === 'AP'){
      // For AP mode
      this.createApplicationForm = new FormGroup({
        name: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)], this.valitateApplicationName.bind(this)),
        emailId: new FormControl('',[Validators.required,Validators.email]),
        description: new FormControl('')
      });
    }else{
      // For OES and both oes and autopilot mode.
      this.createApplicationForm = new FormGroup({
        name: new FormControl('',[Validators.required, this.cannotContainSpace.bind(this)], this.valitateApplicationName.bind(this)),
        emailId: new FormControl('',[Validators.required,Validators.email]),
        description: new FormControl(''),
        imageSource: new FormControl('',Validators.required)
      });
    }

    // defining reactive form for Services Section
    this.servicesForm = new FormGroup({
      services: new FormArray([this.setServiceForm()])
    });

    // defining reactive form for Permission Section
    this.groupPermissionForm = new FormGroup({
      userGroups: new FormArray([])
    });

    // defining reactive form for Environment Section
    this.environmentForm = new FormGroup({
      environments: new FormArray([])
    });
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

  // Below function is use to populate permission in usergroup in edit mode
  populatePermissions(formControl,assignedpermission){
    setTimeout(()=>{
      if(this.userGroupPermissions.length > 0){
        this.userGroupPermissions.forEach(permissionId => {
          if(assignedpermission.indexOf(permissionId['permissionId']) > -1){
            formControl.push(
              new FormGroup({
                value: new FormControl(true),
                name: new FormControl(permissionId['permissionId'])
              })
            )
          }else{
            formControl.push(
              new FormGroup({
                value: new FormControl(false),
                name: new FormControl(permissionId['permissionId'])
              })
            )
          }
          
        })
      }else {
        this.populatePermissions(formControl,assignedpermission);
      }
    },500)
  }

  // Below function is use to return relavent service form on basics of userType. i.e,AP , OESOnly or both.
  setServiceForm(){
    let serviceForm = null;
    switch(this.userType){
      case 'OES':
        serviceForm =  new FormGroup({
              serviceName: new FormControl('', [Validators.required,this.cannotContainSpace.bind(this)]),
              pipelines: new FormArray([
                new FormGroup({
                  pipelinetemplate: new FormControl('', Validators.required),
                  dockerImageName: new FormGroup({
                    accountName: new FormControl('', Validators.required),
                    imageName: new FormControl('', Validators.required)
                  }),
                  pipelineParameters: new FormArray([])
                })
              ])
            })
        break;
      case 'AP':
        serviceForm = new FormGroup({
              serviceName: new FormControl('', [Validators.required,this.cannotContainSpace.bind(this)]),
              logTemp: new FormControl(''),
              metricTemp: new FormControl('')
            })
         
        break;
      case 'OES-AP':
        serviceForm = new FormGroup({
              serviceName: new FormControl('', [Validators.required,this.cannotContainSpace.bind(this)]),
              logTemp: new FormControl(''),
              metricTemp: new FormControl(''),
              pipelines: new FormArray([
                new FormGroup({
                  pipelinetemplate: new FormControl('', Validators.required),
                  dockerImageName: new FormGroup({
                    accountName: new FormControl('', Validators.required),
                    imageName: new FormControl('', Validators.required)
                  }),
                  pipelineParameters: new FormArray([])
                })
              ])
            })
        break;
    }
    return serviceForm;
  }

  //Below function is custom valiadator which is use to validate inpute contain space or not. If input contain space then it will return error
  cannotContainSpace(control: FormControl): {[s: string]: boolean} {
  if(control.value !== null){
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
  }
  return null;
  }

  // Below function is custom valiadator which is use to validate userGroup name is already selected or not. If already exist then it will return error
  usergroupExist(control: FormControl): {[s: string]: boolean} {
    if(control.value !== null){
      let startingValue = control.value.split('');
      let counter = 0;
      if(startingValue.length > 0){
        this.groupPermissionForm.value.userGroups.forEach(groupName => {
          if(this.groupProperties(true,groupName.userGroupId) === control.value){
            counter++;
          }
        })
      }
      if(counter > 0){
        return {groupNameExist: true}
      }
    }
    return null;
  }

  //Below function is use to populate docker image name dropdown 
  populateDockerImagenDropdown(){
    const arrayControl = this.servicesForm.get('services') as FormArray;
    const innerarrayControl = arrayControl.at(0).get('pipelines') as FormArray;
    const mainData = innerarrayControl.at(0).get('dockerImageName');
    this.dockerImageDropdownData = [];
    if(this.editMode){
      this.servicesForm.value.services.forEach((service,SerIndex) => {
        this.dockerImageData.forEach((docker,imgIndex) => {
          if(service.pipelines[0].dockerImageName.accountName === docker.imageSource){
            this.dockerImageDropdownData[SerIndex] = this.dockerImageData[imgIndex].images;
          }
        });
      })
    }else{
      this.dockerAccountName = this.dockerImageData[0].imageSource;
      mainData.patchValue({
          'accountName': this.dockerImageData[0].imageSource
      });
      this.servicesForm.value.services.forEach(() => {
        this.dockerImageDropdownData.push(this.dockerImageData[0].images);
      })
    }
  }

   //Below function is use to populate UserGroup dropdown exist in user group section. 
   populateUserGroupsDropdown(){
    this.userGroupDropdownData = [];
    this.groupPermissionForm.value.userGroups.forEach((groupName,index) => {
      if(index<1){
        this.userGroupDropdownData.push(this.userGroupData);
      }else{
        this.userGroupDropdownData[index] = this.userGroupDropdownData[index-1].filter(el => el.userGroupId !== +this.groupPermissionForm.value.userGroups[index-1].userGroupId);
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

  // Below function is use to populate newley created template into appropriate service field
  populateSelectedTemplateName(index,type){
    if(index > -1){
      const arrayControl = this.servicesForm.get('services') as FormArray;
      const innerarrayControl = arrayControl.at(index).get(type) 
      if(this.userType.includes('AP')){
        if(type === 'logTemp'){
          innerarrayControl.patchValue(this.logTemplateData[this.logTemplateData.length-1].templateName);
        }else{
          innerarrayControl.patchValue(this.metricTemplateData[this.metricTemplateData.length-1].templateName);
        }
      }
    }
  }

  // Below function is use to return proper group value
  groupProperties(name,props){
    let prop = '';
    if(name){
      this.userGroupData.forEach(group => {
        if(group.userGroupId === +props){
          prop = group.userGroupName;
        }
      })
    }else{
      props.forEach((permission,index) => {
        if(permission.value === true){
          prop +=  prop === '' ? permission.name : ','+permission.name;
        }
      });
    }
    return prop;
  }

  // Below function is use to check whether permission is selected or not after selection of usergroup.
  permissionContrlValid(controlvalue){
    let counter = 0;
    controlvalue.value.forEach(permission => {
      if(permission.value === true){
        counter++;
      }
    });
    if(counter > 0){
      controlvalue.setErrors(null);
    }else{
      controlvalue.setErrors({'incorrect': true});
    }
    return counter > 0 ? false : true;
  } 

  //Below function is use to add more permission group
  addGroup() {
    const index = this.groupPermissionForm.value.userGroups.length > 0 ? this.groupPermissionForm.value.userGroups.length : 0;
    // pushing controls in usergroup form.
    const userGroupControl = this.groupPermissionForm.get('userGroups') as FormArray;
    userGroupControl.push(
      new FormGroup({
        userGroupId: new FormControl('',[Validators.required,this.usergroupExist.bind(this)]),
        permissionIds: new FormArray([])
      })
    );

    // pushing controls in permissionIDs
    const permissionIdGroupControl = userGroupControl.at(index).get('permissionIds') as FormArray;
    this.userGroupPermissions.forEach(permissionId => {
      permissionIdGroupControl.push(
        new FormGroup({
          value: new FormControl(false),
          name: new FormControl(permissionId['permissionId'])
        })
      )
    })
    
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
    (<FormArray>this.servicesForm.get('services')).push(this.setServiceForm());
    // Update dockerImageDropdownData array
    if(this.userType.includes('OES')){
      this.dockerImageDropdownData.push(this.dockerImageData[0].images);
      const arrayControl = this.servicesForm.get('services') as FormArray;
      const innerarrayControl = arrayControl.at(this.servicesForm.value.services.length-1).get('pipelines') as FormArray;
      const mainData = innerarrayControl.at(0).get('dockerImageName');
      mainData.patchValue({
          'accountName': this.dockerImageData[0].imageSource
      });
    }
  }

  //Below function is use to delete existing service fron Service Section
  deleteService(index) {
    $("[data-toggle='tooltip']").tooltip('hide');
    (<FormArray>this.servicesForm.get('services')).removeAt(index);
     // Update dockerImageDropdownData array
     this.dockerImageDropdownData.splice(index, 1);
  }
  
  //valid all form data if something is left
  validForms() {
    // displaying error on reqd field which is invalid
    this.createApplicationForm.markAllAsTouched();
    this.servicesForm.markAllAsTouched();
    this.environmentForm.markAllAsTouched();
    this.groupPermissionForm.markAllAsTouched();
  }

  // Below function is execute after click on add template btn.
  onAddTemplate(index,type){
    $("[data-toggle='tooltip']").tooltip('hide');
    if(type === "log"){
      this.currentLogTemplateIndex = index;
    }else{
      this.currentMetricTemplateIndex = index;
    }
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
      if (this.createApplicationForm.valid && this.servicesForm.valid && this.groupPermissionForm.valid) {

        // Saving all 4 forms data into one
        this.mainForm = this.createApplicationForm.value;
        // Below is configuration related to service section when userType contain OES.
        if(this.userType.includes('OES')){
          this.servicesForm.value.services.forEach((ServiceArr, i) => {
            ServiceArr.pipelines.forEach((PipelineArr, j) => {
              PipelineArr.pipelineParameters.forEach((DataArr, k) => {
                if (DataArr.value === '') {
                  DataArr.value = this.getProperValue(i, j, k)
                }
              })
            })
          })
        }
        
        this.mainForm.services = this.servicesForm.value.services;
        // usergroups section
        this.mainForm.userGroups = this.groupPermissionForm.value.userGroups.map(usergroupData => {
          let usergroupObj:GroupPermission = {
            userGroupId: usergroupData.userGroupId,
            permissionIds:[]
          }
          usergroupData.permissionIds.forEach(permission => {
            if(permission.value === true){
              usergroupObj.permissionIds.push(permission.name);
            }
          });
          return usergroupObj;
        });

        if(this.userType.includes('OES')){
          this.mainForm.environments = this.environmentForm.value.environments;
        }
        if(this.userType.includes('AP')){
          this.mainForm.logTemplate = this.logTemplateData;
          this.mainForm.metricTemplate = this.metricTemplateData;
        }
        
        //Below action is use to save created form in database
        console.log("post data create application",JSON.stringify(this.mainForm));
        if(this.editMode){
          this.store.dispatch(ApplicationActions.updateApplication({appData:this.mainForm,applicationId:this.appData.id}));
        }else{
          this.store.dispatch(ApplicationActions.createApplication({appData:this.mainForm}));
        }
        
      } else {
        this.validForms();
      }
  }
}
