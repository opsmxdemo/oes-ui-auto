import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
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
import { SaveApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/saveApplicationModel';
import { Environment } from 'src/app/models/applicationOnboarding/createApplicationModel/environmentModel/environment.model';
import { Visibility } from 'src/app/models/applicationOnboarding/createApplicationModel/visibilityModel/visibility.model';
import { AppPage } from 'e2e/src/app.po';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less']
})
export class CreateApplicationComponent implements OnInit {

  @ViewChild('logModel') logModel: ElementRef;
  @ViewChild('metricModel') metricModel: ElementRef;
  @ViewChild(JsonEditorComponent, { static: false }) tooltypeTemplateEditorJson: JsonEditorComponent;
  @ViewChild('tooltypeTemplateModel') tooltypeTemplateModel: ElementRef;
  @ViewChild('newtemplate') newtemplate: ElementRef;
  @ViewChild('edittemplate') edittemplate: ElementRef;


  userType = '';                                            // It contain type of user i.e, AP, OES or both.
  createApplicationForm: FormGroup;                               // For Application Section
  groupPermissionForm: FormGroup;                                 // For Permission Section
  servicesForm: FormGroup;                                        // For Services Section
  environmentForm: FormGroup;                                     // For Environment Section
  gateForm: FormGroup;                                            // For GateName Section
  visibilityForm: FormGroup;                                      // For Visibility Section
  fetchedPipelineTemplateParameters: PipelineTemplate[];          // For fetched pipeline_parameter through api used in serviceForm
  pipelineExists: Pipeline;                                       // For populating the pipeline Type dropdown exist in services section.
  mainForm: CreateApplication = null;                             // It contain data of all 3 forms which send to backend after successful submission.
  appForm: SaveApplication = null;                                // It contain data of application form
  servForm: SaveApplication = null;                                // It contain data of application form
  envForm: Environment = null;                                    // It contain data of environment form
  visForm: Visibility = null;                              // It contain data of visibilty form
  groupForm: GroupPermission = null;
  cloudAccountExist: CloudAccount;                                // It contain data of all cloud Account exist.  
  editMode: boolean = false                                       // It use to define form is in edit phase
  appData: CreateApplication = null;                              // It use to hold application fetch from api.  
  envData: any;                              // It use to hold application fetch from api. 
  grpData: any;                              // It use to hold application grouppermissions fetch from api.                                                                                                                                                               
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
  userGroupPermissions: Object[] = [];                             // It is use to store value of checkbox need to display in group section.
  editApplicationCounter: number = 0;                              // It is use to restrict reexecuting of edit application method.
  editTemplateIndex = -1;                                         // It is use to store index value of template which user want to edit.
  templateEditMode = false;                                       // It is use to store true while user want to edit template parameter.
  editTemplateData = null;                                        // It is use to store data of template which user want to update.
  apiLoadingError = false;                                        // It is use to show or hide component error message.
  isMetricTemplateClicked = true;
  errorMessage = `<div><b>Application creation requires image source(s) and pipeline template(s).</b></div><ul><li>Please create an image source via  "Data sources" -> "New Data Source" -> Select Monitoring Provider To Create DataSource.</li><li>Pipeline template needs to be create in Spinnaker.If you are sure that these are there, Please refresh the page after some time.</li></ul>`
  featureList: any;
  user: any;                                                                    //Fix for the nonAdmin filter in let user of userGroupDropdownData[i]  | nonAdmins: 
  exerciseAp = {
    data: [{ param: "logTemp" }, { param: "metricTemp" }]
  };
  showFeatures: boolean = false;
  userIndex: any;
  showDat: boolean;

  savedApplicationData: any;
  applicationId: number;
  savedServiceData: any;
  serviceId: string;

  //visibility
  gateData: any;
  gateId: any;
  approvalGatesList: any;
  isEditGateEnabled: boolean = false;
  configuredToolTypes: any;
  toolTypes: any = [];
  toolTypesConfiguredForGate: any;
  templatesForToolType: any = [];
  accountsForTooltypes: any = [];
  selectedTTTemplateTab = 'tooltype-template-form';
  public tooltypeTemplateEditor: JsonEditorOptions;
  public tooltypeTemplateData: any = null;
  templateId: any = [];
  connectorId: any;
  approvalGatesOfaServiceList: any;
  toolType: any;
  isVisibilityConfigured: boolean = false;
  isVisibilityToolConnectorConfigured: boolean = false;

  showserviceGroup: boolean;
  configuredFeature: any = {}
  isFeaturePresent: any = {}

  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [

  ];
  selectedFeature = [];
  toolTemplateForm: FormGroup;
  toolTypeRowHoverd: any = [];
  templateDataForToolType: any;
  editTemplateTriggered: boolean;
  editTemplateTriggeredID: any;
  addNewConnectorAllowed: boolean = false;
  saporFinalData: any;
  showApplicationForm: boolean = false;
  showServiceForm: boolean = false;
  showEnvironmentForm: boolean = false;
  showPermissionForm: boolean = false;
  appInfoData: any;
  environmentsList: any;
  hideVisibilityPlusIcon: boolean;
  currentRowIndexVisibility: number = 0;
  editConnectorRow: any = [];
  toolTypeDataSaved: any = [];
  toolTypesCount: number = 0;

  deploymentVerificationForm : FormGroup;
  logTemplatesForaApplication: any;
  logTemplateList : any;
  metricTemplateList : any;
  metricTemplatesofaApplication : any;
  serviceName : any;
  logTemplate : any;
  metricTemplate : any;
  logTemplateDetails : any;
  metricTemplateDetails : any;
  logTemplateEditMode : boolean = false;
  metricTemplateEditMode : boolean = false;
  selectedApplicationData : any;
  currentServiceIndex: number = 0;
  configuredVisibilityToolConnectorData: any;                            // Store visibility configured visibility data for edit Mode
  editVisibilityIndex: number ;
  configuredImage: any;

  constructor(public sharedService: SharedService,
    public store: Store<fromFeature.State>,
    public appStore: Store<fromApp.AppState>,
    public router: Router,
    private formBuilder: FormBuilder,
    private render: Renderer2,
    private eleRef: ElementRef) { }

  ngOnInit() {
    this.defineAllForms();
    this.loadApplicationForm();
    this.showserviceGroup = true;
    this.gateId = "";

    this.showDat = false;
    // Reseting metric and log Templates data
    this.store.dispatch(ApplicationActions.resetTemplateData());

    // Below function is use to fetch data from AppState to update usertype
    this.appStore.select('layout').subscribe(
      (layoutRes) => {
        // if(layoutRes.installationMode !== ''){
        //   this.userType = layoutRes.installationMode;
        //   if(this.userType.includes('OES')){
        //     //Dispatching action to load initial oes data to populate dropdown
        //     this.store.dispatch(ApplicationActions.loadOESData());
        //   }
        // }
        if (layoutRes.supportedFeatures != null) {
          //this.featureList = ["sapor","deployment_verification","visibility"];
          this.featureList = layoutRes.supportedFeatures;
          const saporExist = this.featureList.some(item => item.includes("sapor"));
          if (saporExist) {
            this.store.dispatch(ApplicationActions.loadOESData());
            this.userType = this.featureList[0];
          }
          //this.saporExist = saporExist;

          // if(this.featureList.some(item => item.includes('Deployment Verification'))){
          //  this.userType = 'Deployment Verification';
          //Dispatching action to load initial oes data to populate dropdown
          //  this.store.dispatch(ApplicationActions.loadOESData());
          // }
        }
      }
    )

    this.editTemplateForm();

    // fetching data from store and check editMode mode is enable or disabled
    this.store.select(fromFeature.selectApplication).subscribe(
      (responseData) => {
        //this.apploading = responseData.applicationLoading;
        this.parentPage = responseData.parentPage;

        if (responseData.initalOESDatacall === true && this.userType.includes('sapor')) {
          let counter = 0;
          if (responseData.initalOESDataLoaded.indexOf('calling') > -1) {
            //this.apploading = true;
          } else {
            //this.apploading = false;
          }
          responseData.initalOESDataLoaded.forEach(data => {
            if (data === 'error') {
              counter++;
            }
          })
          if (counter > 0) {
            this.apiLoadingError = true;
          } else {
            this.apiLoadingError = false;
          }
        }


        // checking sapor editMode

        if (responseData.saporConfigList !== null) {
          console.log(responseData.saporConfigList);
          this.saporFinalData = responseData.saporConfigList;
        }

        // alert(responseData.editMode);

        //checking is editMode enabled
        if (responseData.editMode && responseData.applicationData != null && this.editApplicationCounter === 0) {
          
          this.appInfoData = responseData.applicationData;
          this.appData = responseData.applicationData;
          this.selectedApplicationData = this.appData;
        //  this.applicationId = this.appData.applicationId;
          console.log(this.appData);
          this.editMode = responseData.editMode;
          
          this.defineAllForms();

          if (responseData.applicationData !== null) {
            this.editApplicationCounter++;
            // Reseting metric and log Templates data
            this.store.dispatch(ApplicationActions.resetTemplateData());
            //populating createApplicationForm ################################################################
            this.applicationId = this.appData.applicationId;
            if(responseData.imageSourceListData != null && responseData.isfetchImageSourceLoaded){
              console.log(responseData.imageSourceListData);
              this.configuredImage = responseData.imageSourceListData.imageSource;
              this.createApplicationForm = new FormGroup({
                name: new FormControl(this.appData.name),
                emailId: new FormControl(this.appData.email, [Validators.required, Validators.email]),
                description: new FormControl(this.appData.description),
                imageSource: new FormControl(responseData.imageSourceListData.imageSource),
                lastUpdatedTimestamp: new FormControl(this.appData.lastUpdatedTimestamp)
              });
              if (responseData.callDockerImageDataAPI) {
                this.onImageSourceSelect(this.configuredImage);
              }
            }else{
              this.createApplicationForm = new FormGroup({
                name: new FormControl(this.appData.name),
                emailId: new FormControl(this.appData.email, [Validators.required, Validators.email]),
                description: new FormControl(this.appData.description),
                imageSource: new FormControl(''),
                lastUpdatedTimestamp: new FormControl(this.appData.lastUpdatedTimestamp)
              });
            }

           

            

          
            if (this.editMode) {

             

              // this.editServiceClick(this.appData.services[0]);
              if(this.appData.services && this.appData.services.length > 0) {
                this.currentServiceIndex = 0;
                this.serviceId = this.appData.services[0].id;
                this.store.dispatch(ApplicationActions.getFeaturesForAService({serviceId: this.appData.services[0].id}));
                // this.setServiceForm(this.appData.services[0])

                this.showserviceGroup = false;
                var totalServices = this.appData.services.length
                this.servicesForm = new FormGroup({
                  services: new FormArray([])
                });
                for (let i = 0; i < totalServices; i++) {
                  (<FormArray>this.servicesForm.get('services')).push(
                    new FormGroup({
                      serviceName: new FormControl({ value: this.appData.services[i].name, disabled: true }),
                      featureName: new FormControl(''),
                      serviceId: new FormControl({ value: this.appData.services[i].id, disabled: true })
                    })
                  )
                  if(!this.isFeaturePresent[this.appData.services[i].id]) this.isFeaturePresent[this.appData.services[i].id] = {};
                  
                  // this.selectFeature(this.featureList[0], i)
                }
              }
            }

          } else {
            this.defineAllForms();
          }
        } else if (responseData.applicationData == null && this.imageSourceData === null) {
          // defining all forms when not in edit mode
          if (this.createApplicationForm === undefined && this.servicesForm === undefined) {
            this.defineAllForms();
          }
        }
      }
    )

    // Below function is use to fetching data from state related to pipelineData
    this.store.select(fromFeature.selectApplication).subscribe(
      (response: any) => {
         // checking environments data editMode
         if (response.environmentsListData != null && response.isEnviromentsLoaded){
       
          this.envData = response.environmentsListData;

          if(this.editMode){
            
            
            //if(this.envData.environments != undefined){
              this.envData.environments.forEach(environmentdata => {
                (<FormArray>this.environmentForm.get('environments')).push(
                  new FormGroup({
                    key: new FormControl(environmentdata.key, Validators.required),
                    value: new FormControl(environmentdata.value),
                    // id: new FormControl(environmentdata.id)
                  })
                );
              })
            //}
          }
        }else{
         
        }

        if(response.serviceFeatureList != null && response.isServiceFeatureListLoaded) {
          console.log(response.serviceFeatureList);
          this.configuredFeature[response.serviceId] = response.serviceFeatureList.configuredFeatures ? response.serviceFeatureList.configuredFeatures : [];
          // this.configuredFeature.push({
          //   "configuredFeatures": [
          //       "deployment_verification",
          //       "sapor",
          //       "visibility"
          //     ]
          //   }
          // )
          this.featureList.forEach(fea => {
            if(!this.isFeaturePresent[response.serviceId]) this.isFeaturePresent[response.serviceId] = {};
            this.isFeaturePresent[response.serviceId][fea] = false;
          });
          this.configuredFeaturepresent(response.serviceId);
        }

       //populate groupPermission Form #############################################################################
        if(response.groupPermissionsGetListData != null && response.isGroupPermissionsLoaded){
          this.grpData = response.groupPermissionsGetListData;
          console.log(this.grpData);
          //  // clearing form first
           this.groupPermissionForm = new FormGroup({
            userGroups: new FormArray([])
          });
          //populating the form
          const userGroupControl = this.groupPermissionForm.get('userGroups') as FormArray;
          this.grpData.forEach((groupData, index) => {
            // pushing controls in usergroup form.
            userGroupControl.push(
              new FormGroup({
                userGroupId: new FormControl(groupData.userGroupId, [Validators.required, this.usergroupExist.bind(this)]),
                permissionIds: new FormArray([])
              })
            );

            // pushing controls in permissionIDs
            const permissionIdGroupControl = userGroupControl.at(index).get('permissionIds') as FormArray;
            this.populatePermissions(permissionIdGroupControl, groupData.permissionIds);
          })
        }else{
          this.groupPermissionForm = new FormGroup({
            userGroups: new FormArray([])
          });
        }

        if (response.pipelineData !== null) {
          this.pipelineExists = response.pipelineData;
        }
        if (response.imageSource !== null) {
          this.imageSourceData = response.imageSource;
          if(response.imageSourceListData != null && response.isfetchImageSourceLoaded){
            console.log(response.imageSourceListData);
            this.createApplicationForm = new FormGroup({
              name: new FormControl(this.appData.name),
              emailId: new FormControl(this.appData.email, [Validators.required, Validators.email]),
              description: new FormControl(this.appData.description),
              imageSource: new FormControl(response.imageSourceListData.imageSource),
              lastUpdatedTimestamp: new FormControl(this.appData.lastUpdatedTimestamp)
            });
            if (response.callDockerImageDataAPI) {
              this.onImageSourceSelect(response.imageSourceListData.imageSource);
            }
          }
        }
        if (response.savedApplicationData != null) {
          this.savedApplicationData = response.savedApplicationData;
          this.applicationId = this.savedApplicationData.applicationId;
          this.selectedApplicationData = this.savedApplicationData;          
        }
        if (response.savedServiceData != null) {
          this.savedServiceData = response.savedServiceData;
          this.serviceId = this.savedServiceData.id;
          this.serviceName = this.savedServiceData.name;
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
        if (response.logtemplate.length > 0) {
          this.logTemplateData = response.logtemplate;
          if (this.logModel !== undefined) {
            this.logModel.nativeElement.click();
          }
          this.populateSelectedTemplateName(this.currentLogTemplateIndex, 'logTemp')
        }
        if (response.metrictemplate.length > 0) {
          this.metricTemplateData = response.metrictemplate;
          if (this.metricModel !== undefined) {
            this.metricModel.nativeElement.click();
          }
          this.populateSelectedTemplateName(this.currentMetricTemplateIndex, 'metricTemp')
        }
        if (response.approvalGateSavedData != null && response.isGateSaved) {
          this.store.dispatch(ApplicationActions.isApprovalGateSaved());
          this.gateData = response.approvalGateSavedData;
          this.gateId = response.approvalGateSavedData.id;
          //this.store.dispatch(ApplicationActions.getApprovalGates()); 
          //this.addConnector();
          //this.store.dispatch(ApplicationActions.getConfiguredToolConnectorTypes()); 
          //this.store.dispatch(ApplicationActions.getApprovalGatesOfaService({serviceId : this.serviceId}));      
        }
        // if(response.approvalGatesList != null && response.isApprovalGatesLoaded){
        //   this.store.dispatch(ApplicationActions.isApprovalGatesLoaded());
        //   this.approvalGatesList = response.approvalGatesList;
        //   //this.gateId = this.approvalGatesList[0].id;
        //   console.log(this.approvalGatesList);
        //   //this.addConnector();
        //   //this.store.dispatch(ApplicationActions.getConfiguredToolConnectorTypes());
        // }
        if (response.approvalGatesListOfaService != null && response.isApprovalGatesOfaServiceLoaded) {
          this.store.dispatch(ApplicationActions.isApprovalGatesOfaServiceLoaded());
          this.approvalGatesOfaServiceList = response.approvalGatesListOfaService;
          if (this.approvalGatesOfaServiceList.length > 0) {
            this.gateId = this.approvalGatesOfaServiceList[0].id;   
            if(this.editMode){
              // this.gateForm.value.gateName = this.approvalGatesOfaServiceList[0].id;
              this.gateForm.get('gateName').setValue(this.approvalGatesOfaServiceList[0].name);
              console.log("Approval Gates List: ", this.approvalGatesOfaServiceList);
            }
            //console.log(this.approvalGatesOfaServiceList);
            // this.addConnector();
            this.store.dispatch(ApplicationActions.getToolConnectorForaGate({gateId : this.gateId}));
          }          
        }
        if (response.isApprovalGateEdited) {
          this.isEditGateEnabled = false;
          this.store.dispatch(ApplicationActions.isApprovalGateEdited());
        }
        if (response.configuredToolConnectorTypes != null && response.isConfiguredToolConnectorLoaded) {
          this.store.dispatch(ApplicationActions.isloadedConfiguredToolConnectorTypes());
          this.configuredToolTypes = response.configuredToolConnectorTypes;
          this.toolTypesCount = this.configuredToolTypes.length;
          this.toolTypes[0] = this.configuredToolTypes;          
          console.log("configured Tool Types: ", this.configuredToolTypes);
          if(this.toolTypes[0].length < 2) {
            this.hideVisibilityPlusIcon = true;
          } else {
            this.hideVisibilityPlusIcon = false;
          }
          this.addConnector();
        }
        if (response.accountsForToolType != null && response.isAccountForToolTypeLoaded) {
          this.store.dispatch(ApplicationActions.isLoadedAccountToolType());
          if(!this.editMode){
          this.accountsForTooltypes[this.currentRowIndexVisibility - 1] = response.accountsForToolType;
          }else{
            this.accountsForTooltypes[this.editVisibilityIndex] = response.accountsForToolType;
            
            let visibilityArr = <FormArray>this.visibilityForm.get('visibilityConfig');
            visibilityArr.controls[this.editVisibilityIndex].get('accountName').setValue(this.configuredVisibilityToolConnectorData[this.editVisibilityIndex].visibilityToolConnectorId);

            this.editVisibilityIndex++;
          }
          //this.connectorId = this.accountsForTooltypes[0];
          console.log("Account Types: ", this.accountsForTooltypes);
          console.log("Row index Visibility: ", this.currentRowIndexVisibility);

        }
        if (response.templatesForToolType && response.isTemplateForToolTypeLoaded) {
          this.store.dispatch(ApplicationActions.isLoadedTemplateToolType());
          this.templatesForToolType[this.currentRowIndexVisibility - 1] = response.templatesForToolType;
        }

        this.loadEditTemplate(response);

        if (response.templateForToolTypeSavedData != null && response.isTemplateForTooltypeSaved) {
          this.store.dispatch(ApplicationActions.isTemplateForTooltypeSaved());
          if (this.tooltypeTemplateModel != undefined) {
            this.tooltypeTemplateModel.nativeElement.click();
          }
          this.store.dispatch(ApplicationActions.getTemplatesToolType({ connectorType: this.toolType }));
        }
        if (response.visibilityFeatureSavedData != null && response.isVisibilityFeatureSaved) {
          this.store.dispatch(ApplicationActions.isVisibilityFeatureSaved());
          //console.log(response.visibilityFeatureSavedData);
          this.gateData = response.visibilityFeatureSavedData;
          this.gateId = response.visibilityFeatureSavedData.id;
          //this.store.dispatch(ApplicationActions.getApprovalGates()); 
          //this.addConnector();          
          //this.store.dispatch(ApplicationActions.getConfiguredToolConnectorTypes()); 
          this.store.dispatch(ApplicationActions.getToolConnectorForaGate({ gateId: this.gateId }));
        }
        if (response.approvalGatesListOfaService != null && response.isApprovalGatesOfaServiceLoaded) {
          this.store.dispatch(ApplicationActions.isApprovalGatesOfaServiceLoaded());
          if (response.approvalGatesListOfaService.length > 0) {
            this.isVisibilityConfigured = true;
          } else {
            this.isVisibilityConfigured = false;
          }
        }
        if (response.configuredToolConnectorData != null && response.isToolConnectoreForaGateLoaded) {
          this.store.dispatch(ApplicationActions.isLoadedToolConnectorForaGate());
          console.log("configuredToolConnectorData", response.configuredToolConnectorData);
          //console.log(response.configuredToolConnectorData);
          if (response.configuredToolConnectorData.length > 0) {
            this.isVisibilityToolConnectorConfigured = true;
            this.configuredVisibilityToolConnectorData = response.configuredToolConnectorData

            if(this.editMode){


              this.visibilityForm = new FormGroup({
                visibilityConfig: new FormArray([])
              });
                // name: new FormControl(permissionId['permissionId'])

              for (let i = 0; i < this.configuredVisibilityToolConnectorData.length; i++) {

              this.onChangeTooltype(this.configuredVisibilityToolConnectorData[i].connectorType);
              (<FormArray>this.visibilityForm.get('visibilityConfig')).push(
                  new FormGroup({
                    connectorType: new FormControl(this.configuredVisibilityToolConnectorData[i].connectorType) ,
                    accountName: new FormControl(this.configuredVisibilityToolConnectorData[i].accountName),
                    templateId: new FormControl(this.configuredVisibilityToolConnectorData[i].templateId),
                    templateName: new FormControl(this.configuredVisibilityToolConnectorData[i].templateName),
                    visibilityToolConnectorId: new FormControl(this.configuredVisibilityToolConnectorData[i].visibilityToolConnectorId),
                  })
                );

                this.toolTypeDataSaved[i] = true;
              }
              console.log("Visibility config Details: ", this.visibilityForm);
              
            }

            this.toolTypesConfiguredForGate = response.configuredToolConnectorData.map(ele => ele.connectorType);
            if(this.configuredToolTypes != null && this.configuredToolTypes != undefined){
              let toolTypesValue = this.configuredToolTypes.filter(
                function (i) {
                  return this.indexOf(i) < 0;
                },
                this.toolTypesConfiguredForGate
              );
              setTimeout(() => {
                this.toolTypes[this.currentRowIndexVisibility] = toolTypesValue; 
                if(this.toolTypes[this.currentRowIndexVisibility].length < 2) {
                  this.hideVisibilityPlusIcon = true;
                } else {
                  this.hideVisibilityPlusIcon = false;
                }
                console.log(this.toolTypes); 
                this.addConnector(); 
              }, 100);
            }


          } else {
            this.isVisibilityToolConnectorConfigured = false;
            //this.addConnector();
            this.store.dispatch(ApplicationActions.getConfiguredToolConnectorTypes());
          }
        }
        //response.toolconnectorwithTemplateSavedData !=null && 
        if (response.isToolConnectorwithTemplateSaved) {
          this.store.dispatch(ApplicationActions.isToolConnectorWithTemplateSaved());
          this.addNewConnectorAllowed = true;
        }
        if(response.logTemplatesofaApplication && response.isLogTemplateforApplicationLoaded){
          this.store.dispatch(ApplicationActions.isLoadedLogTemplatesforaApplication());
          console.log("LOg Template for a application");
          console.log(response.logTemplatesofaApplication);
          this.logTemplatesForaApplication =   response.logTemplatesofaApplication.logTemplates.map(ele=>ele.templateName);
          //this.logTemplatesForaApplication = ["logtemp1", "logtemp2", "logtemp3"];
          this.logTemplateList = this.logTemplatesForaApplication;
          if(this.logModel !== undefined){
            this.logModel.nativeElement.click();
          }
        } 
        if(response.metricTemplatesofaApplication && response.isMetricTemplateforApplicationLoaded){
          this.store.dispatch(ApplicationActions.isLoadedMetricTemplatesforaApplication());
          console.log("Metric Template for a application");
          console.log(response.metricTemplatesofaApplication);
          this.metricTemplatesofaApplication =   response.metricTemplatesofaApplication.metricTemplates.map(ele=>ele.pipelineId);
          //this.metricTemplatesofaApplication = ["metrictemp1", "metrictemp2", "metrictemp3"];
          this.metricTemplateList = this.metricTemplatesofaApplication;
          if(this.metricModel !== undefined){
            this.metricModel.nativeElement.click();
          }
        }
        if(response.logTemplateDetails && response.isLogTemplateDetailsLoaded){
          this.store.dispatch(ApplicationActions.isLoadedLogTemplate());
          this.logTemplateDetails = response.logTemplateDetails;        
        } 
        if(response.metricTemplateDetails && response.isMetricTemplateDetailsLoaded){
          this.store.dispatch(ApplicationActions.isLoadedMetricTemplate());
          this.metricTemplateDetails = response.metricTemplateDetails;        
        } 
      }
    )

    //Visibility Tooltype template creation
    this.tooltypeTemplateEditor = new JsonEditorOptions()
    this.tooltypeTemplateEditor.mode = 'code';
    this.tooltypeTemplateEditor.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
  }

  editTemplateForm() {
    this.toolTemplateForm = new FormGroup({
      id: new FormControl(''),
      toolType: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      template: new FormControl('')
    });
  }

  // Below function is use to define all forms exist in application On boarding component
  defineAllForms() {
    // defining reactive form approach for createApplicationForm
    //if(this.userType === 'Deployment Verification'){
    // For AP mode
    this.createApplicationForm = new FormGroup({
      name: new FormControl('', [Validators.required, this.cannotContainSpace.bind(this)]),
      emailId: new FormControl('', [Validators.required, Validators.email]),
      imageSource: new FormControl(''),
      description: new FormControl('')
    });
   

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

    // defining reactive form for Visibility Gate Section
    this.gateForm = new FormGroup({
      gateName: new FormControl('', [Validators.required, this.cannotContainSpace.bind(this)]),
    });

    this.deploymentVerificationForm = new FormGroup({
      logTemplate : new FormControl(""),
      metricTemplate : new FormControl("")
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
        },
        // below contain remove when name check api is implemented
        (error) => {
          resolve(null);
        }
      )
    });
    return promise;
  }

  // Below function is use to populate permission in usergroup in edit mode
  populatePermissions(formControl, assignedpermission) {
    setTimeout(() => {
      if (this.userGroupPermissions.length > 0) {
        this.userGroupPermissions.forEach(permissionId => {
          if (assignedpermission.indexOf(permissionId['permissionId']) > -1) {
            formControl.push(
              new FormGroup({
                value: new FormControl(true),
                name: new FormControl(permissionId['permissionId'])
              })
            )
          } else {
            formControl.push(
              new FormGroup({
                value: new FormControl(false),
                name: new FormControl(permissionId['permissionId'])
              })
            )
          }

        })
      } else {
        this.populatePermissions(formControl, assignedpermission);
      }
    }, 500)
  }

  // Below function is use to return relavent service form on basics of userType. i.e,AP , OESOnly or both.
  setServiceForm(val = {name: '', id: null}) {
    let serviceForm = null;
    serviceForm = new FormGroup({
      serviceName: new FormControl(val.name, [Validators.required, this.cannotContainSpace.bind(this)]),
      featureName: new FormControl(''),
      serviceId: new FormControl(val.id)
    })

    return serviceForm;

  }

  //Below function is custom valiadator which is use to validate inpute contain space or not. If input contain space then it will return error
  cannotContainSpace(control: FormControl): { [s: string]: boolean } {
    if (control.value !== null) {
      let startingValue = control.value.split('');
      if (startingValue.length > 0 && (control.value as string).indexOf(' ') >= 0) {
        return { containSpace: true }
      }
      if (+startingValue[0] > -1 && startingValue.length > 0) {
        return { startingFromNumber: true }
      }
      if (!/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
        return { symbols: true };
      }
    }
    return null;
  }

  // Below function is custom valiadator which is use to validate userGroup name is already selected or not. If already exist then it will return error
  usergroupExist(control: FormControl): { [s: string]: boolean } {
    if (control.value !== null) {
      let counter = 0;
      if (+control.value > 0 && typeof (control.value) !== 'number') {
        this.groupPermissionForm.value.userGroups.forEach(groupName => {
          if (+groupName.userGroupId === +control.value) {
            counter++;
          }
        })
      }
      if (counter > 0) {
        return { groupNameExist: true }
      }
    }
    return null;
  }

  //Below function is use to populate docker image name dropdown 
  populateDockerImagenDropdown() {

    this.dockerImageDropdownData = [];
    if (this.editMode) {
      // this.servicesForm.value.services.forEach((service, SerIndex) => {
      //   this.dockerImageData.forEach((docker, imgIndex) => {
      //     if (service.pipelines[0].dockerImageName.accountName === docker.imageSource) {
      //       this.dockerImageDropdownData[SerIndex] = this.dockerImageData[imgIndex].images;
      //     }
      //   });
      // })
      this.appData.services.forEach(() => {
        this.dockerImageDropdownData.push(this.dockerImageData[0].images);
      })
    } else {
      this.dockerAccountName = this.dockerImageData[0].imageSource;
      const arrayControl = this.servicesForm.get('services') as FormArray;
      if (arrayControl != undefined && arrayControl != null) {
        const innerarrayControl = arrayControl.at(0).get('pipelines') as FormArray;
        if (innerarrayControl != undefined && innerarrayControl != null) {
          const mainData = innerarrayControl.at(0).get('dockerImageName');
          if (mainData != undefined && mainData != null) {
            mainData.patchValue({
              'accountName': this.dockerImageData[0].imageSource
            });
          }
        }
      }
      this.servicesForm.value.services.forEach(() => {
        this.dockerImageDropdownData.push(this.dockerImageData[0].images);
      })
    }
  }

  //Below function is use to populate UserGroup dropdown exist in user group section. 
  populateUserGroupsDropdown() {
    this.userGroupDropdownData = [];
    this.groupPermissionForm.value.userGroups.forEach((groupName, index) => {
      if (index < 1) {
        this.userGroupDropdownData.push(this.userGroupData);
      } else {
        this.userGroupDropdownData[index] = this.userGroupDropdownData[index - 1].filter(el => el.userGroupId !== +this.groupPermissionForm.value.userGroups[index - 1].userGroupId);
      }
    })
  }

  // Below function is use to populate Docker Image name dropdown after selecting ImageSourceData
  onImageSourceSelect(ImageSourceValue) {
    this.store.dispatch(ApplicationActions.loadDockerImageName({ imageSourceName: ImageSourceValue }));
  }

  // Below function is use to populate Docker Image name dropdown after selecting DockerAccountName
  onChangeDockerAcc(event, serviceIndex) {
    this.dockerImageData.forEach(imageName => {
      if (imageName.imageSource === event.target.value) {
        this.dockerImageDropdownData[serviceIndex] = imageName.images;
      }
    })
  }

  // Below function is use to populate newley created template into appropriate service field
  populateSelectedTemplateName(index, type) {
    if (index > -1) {
      const arrayControl = this.servicesForm.get('services') as FormArray;
      const innerarrayControl = arrayControl.at(index).get(type)
      if (this.userType.includes('deployment_verification')) {
        if (type === 'logTemp') {
          if (this.templateEditMode) {
            innerarrayControl.patchValue(this.logTemplateData[this.editTemplateIndex].templateName);
          } else {
            innerarrayControl.patchValue(this.logTemplateData[this.logTemplateData.length - 1].templateName);
          }
        } else {
          if (this.templateEditMode) {
            innerarrayControl.patchValue(this.metricTemplateData[this.editTemplateIndex].templateName);
          } else {
            innerarrayControl.patchValue(this.metricTemplateData[this.metricTemplateData.length - 1].templateName);
          }
        }
      }
    }
  }

  // Below function is use to return proper group value
  groupProperties(name, props) {
    let prop = '';
    if (name) {
      this.userGroupData.forEach(group => {
        if (group.userGroupId === +props) {
          prop = group.userGroupName;
        }
      })
    } else {
      props.forEach((permission, index) => {
        if (permission.value === true) {
          prop += prop === '' ? permission.name : ',' + permission.name;
        }
      });
    }
    return prop;
  }

  // Below function is use to check whether permission is selected or not after selection of usergroup.
  permissionContrlValid(controlvalue) {
    let counter = 0;
    controlvalue.value.forEach(permission => {
      if (permission.value === true) {
        counter++;
      }
    });
    if (counter > 0) {
      controlvalue.setErrors(null);
    } else {
      controlvalue.setErrors({ 'incorrect': true });
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
        userGroupId: new FormControl('', [Validators.required, this.usergroupExist.bind(this)]),
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

  addNewConnector() {
    this.store.dispatch(ApplicationActions.getToolConnectorForaGate({ gateId: this.gateId }));

  }
  //Below function is use to add more permission group
  addConnector() {
    this.addNewConnectorAllowed = false;   
    let formArray = <FormArray>this.visibilityForm.get('visibilityConfig');
    (<FormArray>this.visibilityForm.get('visibilityConfig')).push(
      new FormGroup({
        connectorType: new FormControl('', Validators.required),
        accountName: new FormControl(''),
        _accountName: new FormControl(''),
        templateName: new FormControl(''),
        _templateName: new FormControl(''),
      })
    );
    this.editConnectorRow.push(true);
    this.toolTypeDataSaved.push(false);
    this.editConnectorRowSetAllFalseExcept(this.editConnectorRow.length - 1);
    this.currentRowIndexVisibility = formArray.controls.length;
    this.toolTypeRowHoverd.push(false);
  }

  editConnectorRowSetAllFalseExcept(index) {
    let self = this;
    let visibilityFormArr = <FormArray> this.visibilityForm.controls.visibilityConfig;
    this.editConnectorRow.forEach((row, i) => {
      self.editConnectorRow[i] = false;
      visibilityFormArr.controls[i].get('accountName').disable();
      visibilityFormArr.controls[i].get('templateName').disable();
    });
    this.editConnectorRow[index] = true;
    visibilityFormArr.controls[index].get('accountName').enable();
    visibilityFormArr.controls[index].get('templateName').enable();
  }

  editConnect(index) {
    this.editConnectorRowSetAllFalseExcept(index);
  }

  // Below function is use to remove exist environment 
  removeConnector(index) {
    $("[data-toggle='tooltip']").tooltip('hide');
    (<FormArray>this.visibilityForm.get('visibilityConfig')).removeAt(index);
    if((<FormArray>this.visibilityForm.get('visibilityConfig')).controls.length < this.toolTypesCount) {
      this.hideVisibilityPlusIcon = false;
      this.addNewConnectorAllowed = true;
    }
  }

  // Below function is execute on select of pipeline type in Services Section
  onPipelineSelect(service_index: number, pipeline_parameter_index: number, selectedTemplate: string) {

    const arrayControl = this.servicesForm.get('services') as FormArray;
    const innerSaporConfig = arrayControl.at(service_index).get('saporConfiguration') as FormGroup;

    const innerarrayControl = innerSaporConfig.get('pipelines') as FormArray;
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
    // (<FormGroup>this.servicesForm.get('services')).push(this.setServiceForm());

    (<FormArray>this.servicesForm.get('services')).push(this.setServiceForm());
    this.currentServiceIndex = (<FormArray>this.servicesForm.get('services')).length - 1;
    // Update dockerImageDropdownData array
    //   //if(this.userType.includes('Sapor')){
    //     this.dockerImageDropdownData.push(this.dockerImageData[0].images);
    //     const arrayControl = this.servicesForm.get('services') as FormArray;
    //     const innerarrayControl = arrayControl.at(this.servicesForm.value.services.length-1).get('pipelines') as FormArray;
    //     const mainData = innerarrayControl.at(0).get('dockerImageName');
    //     mainData.patchValue({
    //         'accountName': this.dockerImageData[0].imageSource
    //     });
    // //  }
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
  onAddTemplate(index, type) {
    $("[data-toggle='tooltip']").tooltip('hide');
    if (type === "log") {
      this.currentLogTemplateIndex = index;
      this.logTemplateEditMode = false;
    } else {
      this.currentMetricTemplateIndex = index;
      this.isMetricTemplateClicked = !this.isMetricTemplateClicked;
      this.metricTemplateEditMode = false;
    }
  }

  // Below function is execute after click on edit template btn.
  onEditTemplate(index, type) {
    $("[data-toggle='tooltip']").tooltip('hide');
    this.editTemplateIndex = -1;
    this.currentLogTemplateIndex = -1;
    this.currentMetricTemplateIndex = -1;
    const serviceArrayControl = this.servicesForm.get('services') as FormArray;
    const templatControl = serviceArrayControl.at(index);
    if (type === "log" && templatControl.value.logTemp !== "") {
      this.templateEditMode = true;
      this.currentLogTemplateIndex = index;
      this.logTemplateData.forEach((logdata, index) => {
        // if(templatControl.value.logTemp === logdata.templateName){
        this.editTemplateIndex = index;
        this.editTemplateData = { ...logdata };
        // }
      })
    } else if (type === "metric" && templatControl.value.metricTemp !== "") {
      this.templateEditMode = true;
      this.currentMetricTemplateIndex = index;
      this.metricTemplateData.forEach((metricData, index) => {
        if (templatControl.value.metricTemp === metricData.templateName) {
          this.editTemplateIndex = index;
          this.editTemplateData = { ...metricData };
        }
      })
    }
  }

  //Below function is use to fetch proper value from pipelineExist array and return in result in string format. i.e, related to pipeline templateParameter section
  getProperValue(serviceIndex, pipelineIndex, pipelineTemplateIndex) {
    const pipelineServiceName = this.servicesForm.value.services[serviceIndex].saporConfiguration.pipelines[pipelineIndex].pipelinetemplate;
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
  cancelForm() {
    if (this.editMode) {
      this.createApplicationForm.reset();
      this.environmentForm.reset();
      this.servicesForm.reset();
      this.groupPermissionForm.reset();
    }
    this.router.navigate([this.parentPage]);
  }

  // Below function is use to submit applicatio form
  SubmitApplicationForm() {
    console.log(this.createApplicationForm.value);
    this.appForm = this.createApplicationForm.value;
    if (this.createApplicationForm.value.name) {
      this.showFeatures = true;
    }
    //Below action is use to save created form in database
    if (this.editMode) {
       this.store.dispatch(ApplicationActions.updateApplication({applicationId: this.applicationId,appData: this.appForm}));
    } else {
      this.store.dispatch(ApplicationActions.saveApplication({ applicationData: this.appForm }));
    }
  }

  // Below function is use to save service form
  saveServiceForm(index) {
    console.log(this.servicesForm.value.services[index].serviceName);
    this.servForm = this.servicesForm.value.services[index];
    var serviceDataToSave = {
      "name": this.servicesForm.value.services[index].serviceName
    };
    this.store.dispatch(ApplicationActions.saveService({ applicationId: this.applicationId, serviceSaveData: serviceDataToSave }));

  }

  // Below function is use to submit environments form
  SubmitEnvironmentsForm() {
   
    if (this.editMode && this.environmentForm.valid) {
      this.store.dispatch(ApplicationActions.updateEnvironments({ applicationId: this.applicationId, environmentsListData: this.environmentForm.value }));
      
    } else {
      this.store.dispatch(ApplicationActions.saveEnvironments({ applicationId: this.applicationId, environmentsData: this.environmentForm.value }));
    }
  }

  // Below function is use to delete environments form
  deleteEnvironments() {
    this.store.dispatch(ApplicationActions.deleteEnvironments({applicationId: this.applicationId}));
  }

  // Below function is use to submit group permission form
  SubmitGroupPermissionForm() {
    this.groupForm = this.groupPermissionForm.value.userGroups;
    var userGroupPermissionDataToSave: any = [];
    for (var i = 0; i < this.groupPermissionForm.value.userGroups.length; i++) {
      var groupName = this.userGroupData.find(x => x.userGroupId == this.groupPermissionForm.value.userGroups[i].userGroupId).userGroupName;
      var obj = {
        "userGroupId": this.groupPermissionForm.value.userGroups[i].userGroupId,
        "userGroupName": groupName,
        "permissionIds": this.groupPermissionForm.value.userGroups[i].permissionIds.filter(i => i.value == true).map(ele => ele.name)
      };
      userGroupPermissionDataToSave.push(obj);
    };
   
   if(this.editMode){
    this.store.dispatch(ApplicationActions.updateGroupPermissions({ applicationId: this.applicationId, groupPermissionsListData: userGroupPermissionDataToSave }));

   }else{
    this.store.dispatch(ApplicationActions.saveGroupPermissions({ applicationId: this.applicationId, groupPermissionData: userGroupPermissionDataToSave }));

   }
   
  }

  //Bewlo fucntio is use to delete group permission
  deleteGroupPermissions(){
    this.store.dispatch(ApplicationActions.deleteGroupPermissions({applicationId: this.applicationId}));
  }

  // Below funcion is use to submit sapor data
  SubmitSaporForm(serviceIndex) {
    console.log(JSON.stringify(this.servicesForm.value.services[serviceIndex]));
    const postSapor = {
      applicationId: this.applicationId,
      serviceId: this.serviceId,
      service: {
        serviceName: this.servicesForm.value.services[serviceIndex].serviceName,
        pipelines: this.servicesForm.value.services[serviceIndex].saporConfiguration['pipelines']
      }
    }

    console.log(JSON.stringify(postSapor));

    if(this.editMode){
      this.store.dispatch(ApplicationActions.updateSaporConfig({ applicationId: this.applicationId, serviceId: this.serviceId, saporConfigData: postSapor}));

    }else{
      this.store.dispatch(ApplicationActions.saveSaporConfig({ saporConfigData: postSapor }));

    }
  }

  // Below function is use to delete sapor
  deleteSaporForm(serviceIndex) {

    this.store.dispatch(ApplicationActions.deleteSaporConfig({ applicationId: this.applicationId, serviceId: this.serviceId }));
  }

  // Below function is use to save each connector
  saveConnector(index) {
    console.log(this.visibilityForm.value.visibilityConfig[index]);
    var dataToSaveToolConnectorwithTemplate = {
      templateId: this.templateId[index]
    };
    let visibilityFormArr = <FormArray> this.visibilityForm.controls.visibilityConfig;

    // let _templateName = this.templatesForToolType[index].find(obj => obj.id == visibilityFormArr.controls[index].get('accountName').value);
    // let _accountName = this.accountsForTooltypes[index].find(obj => obj.id == visibilityFormArr.controls[index].get('templateName').value);

    visibilityFormArr.controls[index].get('accountName').disable();
    visibilityFormArr.controls[index].get('templateName').disable();

    // this.toolTypes.forEach((toolType, i) => {
    //   if(toolType == visibilityFormArr.controls[index].get('connectorType').value) {
    //     delete this.toolTypes[i];
    //   }
    // });

    this.store.dispatch(ApplicationActions.saveToolConnectorWithTemplate({gateId: this.gateId, connectorId : this.connectorId, toolconnectorwithTemplateData : dataToSaveToolConnectorwithTemplate}));
    setTimeout(() => {
      this.editConnectorRow[index] = false;
      this.toolTypeDataSaved[index] = true;
    }, 100);
    
  }

  // Bewlow function is use to submit visibility form
  SubmitVisibilityForm() {
    console.log(this.visibilityForm.value);
  }

  // Below function is use to submit visibility gate data
  saveGateForm() {
    console.log(this.gateForm.value.gateName);
    //json to save approvalGate
    // {
    //   "id": 1,
    //   "name": "OES Production Gate",
    //   "serviceId": 1
    // }
    var gateData = {
      "name": this.gateForm.value.gateName,
      "serviceId": this.serviceId
    };
    if (this.isVisibilityConfigured) {
      this.store.dispatch(ApplicationActions.saveApprovalGate({ approvalGateData: gateData }));
    } else {
      this.store.dispatch(ApplicationActions.saveVisibilityFeature({ approvalGateData: gateData }));
    }
  }

  //Below function is use to submit whole form and send request to backend
  SubmitForm() {
    if (this.createApplicationForm.valid && this.servicesForm.valid && this.groupPermissionForm.valid) {

      // Saving all 4 forms data into one
      this.mainForm = this.createApplicationForm.value;
      // Below is configuration related to service section when userType contain OES.
      if (this.userType.includes('sapor')) {
        this.servicesForm.getRawValue().services.forEach((ServiceArr, i) => {
          ServiceArr.pipelines.forEach((PipelineArr, j) => {
            PipelineArr.pipelineParameters.forEach((DataArr, k) => {
              if (DataArr.value === '') {
                DataArr.value = this.getProperValue(i, j, k)
              }
            })
          })
        })
      }

      this.mainForm.services = this.servicesForm.getRawValue().services;
      // usergroups section
      this.mainForm.userGroups = this.groupPermissionForm.value.userGroups.map(usergroupData => {
        let usergroupObj: GroupPermission = {
          userGroupId: usergroupData.userGroupId,
          userGroupName: usergroupData.userGroupName,
          permissionIds: []
        }
        usergroupData.permissionIds.forEach(permission => {
          if (permission.value === true) {
            usergroupObj.permissionIds.push(permission.name);
          }
        });
        return usergroupObj;
      });

      if (this.userType.includes('sapor')) {
        this.mainForm.environments = this.environmentForm.value.environments;
      }
      if (this.userType.includes('deployment_verification')) {
        this.mainForm.logTemplate = this.logTemplateData;
        this.mainForm.metricTemplate = this.metricTemplateData;
      }

      //Below action is use to save created form in database
      if (this.editMode) {
       // this.store.dispatch(ApplicationActions.updateApplication({ appData: this.mainForm }));
      } else {
        this.store.dispatch(ApplicationActions.createApplication({ appData: this.mainForm }));
      }

    } else {
      this.validForms();
    }
  }

  // Below function is use to get the feature type

  selectFeature(item, index) {

    this.selectedFeature[index] = item;
    this.userIndex = index;


    if (item === 'deployment_verification') {
            //check edit mode or create mode
      if(this.editMode){
        this.store.dispatch(ApplicationActions.getTemplatesForaService({applicationId: this.applicationId, serviceId: this.serviceId}));
        this.store.dispatch(ApplicationActions.getLogTemplateforaApplication({applicationId : this.applicationId}));
        this.store.dispatch(ApplicationActions.getMetricTemplateforaApplication({applicationId : this.applicationId}));
      }

    } else if (item === 'sapor') {

      const saporForm = new FormGroup({
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
      });

      this.userType = item;
      const arrayControl = this.servicesForm.get('services') as FormArray;
      const innerarrayControl = arrayControl.at(index) as FormGroup;
      innerarrayControl.addControl('saporConfiguration', saporForm);


      // this.servicesForm.getRawValue().services.forEach((ServiceArr, i) => {
      //   ServiceArr.pipelines.forEach((PipelineArr, j) => {
      //     PipelineArr.pipelineParameters.forEach((DataArr, k) => {
      //       if (DataArr.value === '') {
      //         DataArr.value = this.getProperValue(i, j, k)
      //       }
      //     })
      //   })
      // })

      // edit related code goes here
      if (this.saporFinalData && this.saporFinalData.service.pipelines.length) {

        const innerSaporConfig = arrayControl.at(index).get('saporConfiguration') as FormGroup;
        const pipelineList = innerSaporConfig.get('pipelines') as FormArray;
        const pipelineParam = pipelineList.at(0) as FormGroup;

        pipelineParam.patchValue({
          pipelinetemplate: this.saporFinalData.service.pipelines[0].pipelinetemplate,
          dockerImageName: {
            accountName: this.saporFinalData.service.pipelines[0].dockerImageName.accountName,
            imageName: this.saporFinalData.service.pipelines[0].dockerImageName.imageName,
          }
        })

        if (this.saporFinalData.service.pipelines[0].pipelineParameters !== null && this.saporFinalData.service.pipelines[0].pipelineParameters !== undefined) {
          //populating pipelieParameter array
          this.saporFinalData.service.pipelines[0].pipelineParameters.forEach(pipelineParameterArr => {
            const pipelineParameter = pipelineParam.get('pipelineParameters') as FormArray;
            pipelineParameter.push(
              new FormGroup({
                value: new FormControl(pipelineParameterArr.value),
                name: new FormControl(pipelineParameterArr.name),
                type: new FormControl(pipelineParameterArr.type)
              })
            );
          })
        }

      }

    } else if (item === 'visibility') {
      //check gate already configured for the selectd service
      // console.log(this.serviceId);
        this.editVisibilityIndex = 0;
      this.visibilityForm = new FormGroup({
        visibilityConfig: new FormArray([])
      });

      // this.store.dispatch(ApplicationActions.getApprovalGatesOfaService({ serviceId: this.serviceId }));
      this.store.dispatch(ApplicationActions.getApprovalGatesOfaService({ serviceId: 77 }));

      // defining reactive form for Visibility connector template Section



    }


  }


  // refactor code functions goes here

  getApplicationDetails() {

  }



  // selectFeature(item:string){
  //   this.selectedFeature = item;
  // }



  clearGateName() {
    this.gateForm.reset();
  }

  onClickEditOfGateName() {

    console.log(this.gateForm.value.gateName);
    this.isEditGateEnabled = true;
  }

  onEditGateName() {
    var approvalGateToEdit = {
      "id": this.gateId,
      "name": this.gateForm.value.gateName,
      "serviceId": 1
    }
    this.store.dispatch(ApplicationActions.editApprovalGate({ gateId: this.gateId, gateDataToEdit: approvalGateToEdit }));
  }

  onDeleteGateName() {
    this.store.dispatch(ApplicationActions.deleteApprovalGate({ gateId: this.gateId }));
  }

  onChangeTooltype(tooltype) {
    console.log(tooltype);
    this.toolType = tooltype;
    this.store.dispatch(ApplicationActions.getAccountToolType({ connectorType: tooltype }));
    this.store.dispatch(ApplicationActions.getTemplatesToolType({ connectorType: tooltype }));
  }

  onChangeAccountofTooltype(account) {
    console.log(account);
    this.connectorId = account;

  }

  onChangeTemplateofTooltype(template, index) {
    if (template == '+') {
      this.templateId[index] = '';
      let visibilityConfigFormArray = this.visibilityForm.get('visibilityConfig') as FormArray
      visibilityConfigFormArray.controls[index].get('templateName').setValue('');
      let toolType = visibilityConfigFormArray.controls[index].get('connectorType').value;

      if (!toolType) {
        // Show validation on Tool type field and alert user to select Tool type first.
      }

      this.toolTemplateForm.setValue({
        id: null,
        toolType: toolType,
        name: '',
        template: ''
      });
      this.toolTemplateForm.controls.id.disable();
      this.selectedTTTemplateTab = 'tooltype-template-form';
      setTimeout(() => {
        this.newtemplate.nativeElement.click();
      }, 100);

      return;
    }
    console.log(template);
    this.templateId[index] = template;
  }

  editTemplate(index) {
    if (this.templateId[index]) {
      this.templateEditMode = true;
      this.store.dispatch(ApplicationActions.getTemplateDataForTooltype({ templateId: this.templateId[index] }));
      this.editTemplateTriggered = true;
      this.editTemplateTriggeredID = this.templateId[index];
    }
  }

  loadEditTemplate(response) {
    if (response.templateData && response.isTemplateDataForToolTypeLoaded) {
      this.store.dispatch(ApplicationActions.isLoadedTemplateData());
      this.templateDataForToolType = response.templateData;
      console.log(this.templateDataForToolType);
      if (this.editTemplateTriggered) {
        this.toolTemplateForm.controls.id.enable();
        this.toolTemplateForm.setValue({
          id: this.templateDataForToolType.id,
          toolType: this.templateDataForToolType.toolType,
          name: this.templateDataForToolType.name,
          template: this.templateDataForToolType.template
        });
        this.editTemplateTriggered = false;
        setTimeout(() => {
          this.edittemplate.nativeElement.click();
        }, 100);
      }
    }
  }

  saveToolTypeTemplateForm() {
    if (this.toolTemplateForm.valid) {
      this.tooltypeTemplateData = this.toolTemplateForm.value;
      this.saveTooltypeTemplate();
    }
  }

  saveTooltypeTemplate() {
    console.log(this.tooltypeTemplateData);
    if (this.tooltypeTemplateData.id) {
      this.store.dispatch(ApplicationActions.updateTemplateForTooltype({ updatedTemplateForToolTypeData: this.tooltypeTemplateData }));
    }
    else {
      this.store.dispatch(ApplicationActions.saveTemplateForTooltype({ templateForToolTypeData: this.tooltypeTemplateData }));
    }

    if (this.tooltypeTemplateModel !== undefined) {
      this.tooltypeTemplateModel.nativeElement.click();
    }
  }

  deleteVisibilityFeature() {
    this.store.dispatch(ApplicationActions.deleteVisibilityFeature({ serviceId: this.serviceId, gateId: this.gateId }));
  }

  closeTemplatePopup() {
    this.templateEditMode = false;
  }

  //Below function is use to fetched json from json editor
  getJsonFromTooltypeTemplateEditor(event = null) {
    this.tooltypeTemplateData = this.tooltypeTemplateEditorJson.get();
  }


  onClickTemplateTab(event) {
    if (event === 'tooltype-template-form-tab') {
      this.selectedTTTemplateTab = 'tooltype-template-form';
    } else if (event === 'tooltype-template-editor-tab') {
      this.selectedTTTemplateTab = 'tooltype-template-editor';
    }
  }

  autoFocus(focusedClass) {
    this.showserviceGroup = true;

  }
  configuredFeaturepresent(serviceId) {

    // for (let i = 0; i < totalServices; i++) {
      // var myjson = {
      //   // servicename: this.appData.services[i].serviceName,
      //   serviceFeatures: []
      // }
      if(!this.isFeaturePresent[serviceId]) this.isFeaturePresent[serviceId] = {};

      for (let j = 0; j < this.featureList.length; j++) {
        if (this.configuredFeature[serviceId].includes(this.featureList[j].toLowerCase())) {
          this.isFeaturePresent[serviceId][this.featureList[j].toLowerCase()] = true;
        } else {
          this.isFeaturePresent[serviceId][this.featureList[j].toLowerCase()] = false;
        }
      }
    // }

  }

  loadServiceForm() {
    // this.applicationId = this.appData.applicationId;
    // this.store.dispatch(ApplicationActions.getEnvironments({ applicationId: this.applicationId }));
    this.showServiceForm = true;
    this.showApplicationForm = false;
    this.showEnvironmentForm = false;
    this.showPermissionForm = false;
  }

  editServiceClick(service: any, index) {
    console.log(service);
    this.serviceId = service.serviceId;
    this.currentServiceIndex = index;
    this.store.dispatch(ApplicationActions.getFeaturesForAService({serviceId: service.serviceId}))
    this.loadServiceForm();
    this.store.dispatch(ApplicationActions.getSaporConfig({ applicationId: this.applicationId, serviceId: this.serviceId }));

    // this.configuredFeaturepresent(service.serviceId);
  }

  loadApplicationForm() {
  
    this.showServiceForm = false;
    this.showEnvironmentForm = false;
    this.showPermissionForm = false;
    this.showApplicationForm = true;


  }

  loadEnvironmentsForm() {
    // debugger
    this.environmentForm.reset();
    this.environmentForm = new FormGroup({
      environments: new FormArray([])
    });
     if(this.editMode){
      this.applicationId = this.appData.applicationId;
      this.store.dispatch(ApplicationActions.getEnvironments({ applicationId: this.applicationId }));

      //populate environment Form if usertype include OES in it#################################################################################
    
         
         
        } else{

        }

   // this.store.dispatch(ApplicationActions.loadEnvironments({}))
    this.showEnvironmentForm = true;
    this.showPermissionForm = false;
    this.showApplicationForm = false;
    this.showServiceForm = false;


  }

  loadGroupPermissionForm() {
    this.showPermissionForm = true;
    this.showEnvironmentForm = false;
    this.showApplicationForm = false;
    this.showServiceForm = false;

    if(this.editMode){
      this.applicationId = this.appData.applicationId;
      this.store.dispatch(ApplicationActions.getGroupPermissions({ applicationId: this.applicationId }));

    }

  }


  //Deployment Verification
  saveDeploymentVerification(){
    var depVeriObj = { 
      "applicationId" : this.applicationId,
      "serviceName": this.serviceName,
      "serviceId" : this.serviceId ,
      "logTemplateName" : this.deploymentVerificationForm.value.logTemplate,
      "metricTemplateName" : this.deploymentVerificationForm.value.metricTemplate
    };
    this.store.dispatch(ApplicationActions.saveDeploymentVerificationFeature({templateServiceData : depVeriObj}));
  }

  deleteDeploymentVerification(){
    this.store.dispatch(ApplicationActions.deleteDeploymentVerificationFeature({serviceId : this.serviceId, applicationId : this.applicationId}));
  }

  onEditLogMetricTemplateClick(type){
    this.logTemplate = this.deploymentVerificationForm.value['logTemplate'];
    this.metricTemplate = this.deploymentVerificationForm.value['metricTemplate'];
    if(type == 'log'){
      this.store.dispatch(ApplicationActions.getLogTemplateDetails({applicationId : this.applicationId, templateName: this.logTemplate}));
      this.logTemplateEditMode = true;
      //this.store.dispatch(ApplicationActions.getLogTemplateDetails({applicationId : 39, templateName: this.logTemplate}));
    }else if(type == 'metric'){
      this.metricTemplateEditMode = true;
      this.store.dispatch(ApplicationActions.getMetricTemplateDetails({applicationId : this.applicationId, templateName: this.metricTemplate}));
    }
  }
  

}
