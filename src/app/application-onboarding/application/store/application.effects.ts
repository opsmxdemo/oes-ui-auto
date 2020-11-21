import { ofType, createEffect, act } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError, withLatestFrom, flatMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromFeature from '../../store/feature.reducer';
import * as fromApp from '../../../store/app.reducer';
import * as ApplicationAction from './application.actions';
import * as AppDashboardAction from '../../../application/application-dashboard/store/dashboard.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from 'src/app/models/applicationOnboarding/applicationList/applicationList.model';
import { NotificationService } from 'src/app/services/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { SaveApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/saveApplicationModel';
import { Environment } from 'src/app/models/applicationOnboarding/createApplicationModel/environmentModel/environment.model';

//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(ApplicationAction.errorOccured({ errorMessage }));
    }
    switch (errorRes.error.message) {
        case 'Authentication Error':
            errorMessage = 'Invalid login credentials';
            break;
        case 'Email Exist':
            errorMessage = 'This email exist already';
            break;
        default:
            errorMessage = 'Error Occurred';
            break;
    }
    return of(ApplicationAction.errorOccured({ errorMessage }));
}

//below function is use to fetch error and return appropriate comments
const handleOESError = (errorRes: any, index: number) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(ApplicationAction.initialOESCallFail({ errorMessage: errorRes.error.message, index }));
    }
    return of(ApplicationAction.initialOESCallFail({ errorMessage: errorRes.error.message, index }));
}


@Injectable()
export class ApplicationEffect {
    user: any;
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromFeature.State>,
        public appStore: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

    // Below effect is use for fetch imageSource dropdown data.
    fetchImageSource = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.loadOESData),
            switchMap(() => {

                return this.http.get(this.environment.config.endPointUrl + 'oes/accountsConfig/getDockerAccounts').pipe(
                    map(resdata => {
                        return ApplicationAction.fetchImageSource({ imageSource: resdata['data'] });
                    }),
                    catchError(errorRes => {
                        return handleOESError(errorRes, 0);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch pipline dropdown data.
    fetchPipeline = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.loadOESData),
            switchMap(() => {
                return this.http.get<Pipeline>(this.environment.config.endPointUrl + 'oes/appOnboarding/pipelineTemplates').pipe(
                    map(resdata => {
                        return ApplicationAction.fetchPipeline({ pipelineData: resdata['data'] });
                    }),
                    catchError(errorRes => {
                        return handleOESError(errorRes, 1);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch dockerImageName dropdown data.
    fetchDockerImageName = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.loadDockerImageName),
            switchMap((action) => {

                return this.http.get<any>(this.environment.config.endPointUrl + 'oes/appOnboarding/images?imageSource=' + action.imageSourceName).pipe(
                    map(resdata => {
                        return ApplicationAction.fetchDockerImageName({ dockerImageData: resdata['results'] });
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch userGroup dropdown data.
    fetchUserData = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.loadApp, ApplicationAction.enableEditMode),
            switchMap(() => {
                return this.http.get<string[]>(this.environment.config.endPointUrl + 'platformservice/v1/usergroups').pipe(
                    map(resdata => {
                        return ApplicationAction.fetchUserGrops({ userGroupData: resdata })
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch userGroup dropdown data.
    fetchUserPermissionData = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.loadApp, ApplicationAction.enableEditMode),
            switchMap(() => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'platformservice/v1/permissions').pipe(
                    map(resdata => {
                        return ApplicationAction.fetchUserGropsPermissions({ userGroupPermissionsData: resdata })
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch Application data on edit mode.
    onEditApplication = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.enableEditMode),
            switchMap(action => {
                return this.http.get<CreateApplication>(this.environment.config.endPointUrl + 'platformservice/v1/applications/' + action.applicationId).pipe(
                    map(resdata => {

                        return ApplicationAction.fetchAppData({ appData: resdata, applicationId: action.applicationId })
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Application Data: ' + errorRes.error.error, 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for saved data in create application phase
    onsavedCreateApplicationData = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.createApplication),
            switchMap(action => {
                return this.http.post<CreateApplication>(this.environment.config.endPointUrl + 'dashboardservice/v2/application', action.appData).pipe(
                    map(resdata => {
                        return ApplicationAction.dataSaved({ applicationName: action.appData.name, dataType: 'createApplication' });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Please raise a ticket with tech support with the following information: ' + errorRes.error.error, 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for saved data in save application phase
    saveApplication = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.saveApplication),
            switchMap(action => {
                return this.http.post<SaveApplication>(this.environment.config.endPointUrl + 'dashboardservice/v2/application', action.applicationData).pipe(
                    map(resdata => {
                        this.toastr.showSuccess('Application Saved Successfully', 'SUCCESS');
                        return ApplicationAction.savedApplication({ savedApplicationResponse: resdata, dataType: 'createApplication' });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Please raise a ticket with tech support with the following information: ' + errorRes.error.error, 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for saved data in save service
    saveService = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.saveService),
            switchMap(action => {
                return this.http.post<SaveApplication>(this.environment.config.endPointUrl + 'dashboardservice/v2/applications/' + action.applicationId + '/service', action.serviceSaveData).pipe(
                    map(resdata => {
                        this.toastr.showSuccess('Service Saved Successfully', 'SUCCESS');
                        return ApplicationAction.savedService({ savedServiceResponse: resdata, dataType: 'createService' });
                    }),
                    catchError(errorRes => {
                        //  this.toastr.showError('Please raise a ticket with tech support with the following information: ' + errorRes.error.error, 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for saved data in save application phase
    saveEnvironments = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.saveEnvironments),
            switchMap(action => {
                return this.http.post<Environment>(this.environment.config.endPointUrl + 'oes/appOnboarding/applications/' + action.applicationId + '/environments', action.environmentsData).pipe(
                    map(resdata => {
                        this.toastr.showSuccess('Environments Saved Successfully','Success');
                        return ApplicationAction.postSaveEnvironments({ 'environmentsSavedData': {'status': true} });                  

                       // return ApplicationAction.environmentDataSaved({ applicationName: 'action.environmentsData.name', dataType: 'createApplicationEnvironments' });
                    }),
                    catchError(errorRes => {
                        //     this.toastr.showError('Please raise a ticket with tech support with the following information: ' + errorRes.error.error, 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

     // Effect to get environments
     
     getApplicationEnvironments = createEffect(() =>
     this.actions$.pipe(
         ofType(ApplicationAction.getEnvironments),
         switchMap((action) => {                
             return this.http.get<any>(this.environment.config.endPointUrl + 'oes/appOnboarding/applications/'+action.applicationId+'/environments').pipe(
                 map(resdata => {
                     return ApplicationAction.loadEnvironments({ environmentsListGetData: resdata});
                 }),
                 catchError(errorRes => {
                     return handleError(errorRes);
                 })
             );
         })
     )
 )

   // Effect to update environments

    updateApplicationEnvironments = createEffect(() =>
   this.actions$.pipe(
       ofType(ApplicationAction.updateEnvironments),
       switchMap((action) => {                
           return this.http.put<any>(this.environment.config.endPointUrl + 'oes/appOnboarding/applications/'+action.applicationId+'/environments',action.environmentsListData).pipe(
               map(resdata => {
                this.toastr.showSuccess('Environments updated Successfully', 'Success');

                return ApplicationAction.postSaveEnvironments({ 'environmentsSavedData': {'status': true} });                  

                //   return ApplicationAction.postUpdateEnvironments({ environmentsListUpdatedData: resdata});
               }),
               catchError(errorRes => {
                   return handleError(errorRes);
               })
           );
       })
   ))

      // Below effect is use for delete application present in application
      deleteApplicationEnvironments = createEffect(() =>
      this.actions$.pipe(
          ofType(ApplicationAction.deleteEnvironments),
          switchMap((action) => {
              return this.http.delete<any>(this.environment.config.endPointUrl + 'oes/appOnboarding/applications/'+action.applicationId+'/environments').pipe(
                  map(resdata => {
                    this.store.dispatch(ApplicationAction.getEnvironments({ applicationId: action.applicationId }));
                     this.toastr.showSuccess('Environments deleted successfully!!', 'SUCCESS');
                      return ApplicationAction.environmentdeletedSuccessfully();
                    }),
                  catchError(errorRes => {
                    //   this.toastr.showError('Application is not deleted due to: ' + errorRes.error.error, 'ERROR')
                      return handleError(errorRes);
                  })
              );
          })
      )
  )

 

    // Below effect is use for saved data in save group permission 

    saveGroupPermissions = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.saveGroupPermissions),
            switchMap(action => {
                return this.http.post<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/applications/' + action.applicationId + '/usergroups/permissions', action.groupPermissionData).pipe(
                    map(resdata => {
                        return ApplicationAction.postSaveGroupPermissions({ 'groupPermissionSavedData': {'status': true} });                  

                        this.toastr.showSuccess("Group Permissions Saved Successfully","Success");

                        return ApplicationAction.groupPermissionDataSaved({ applicationName: 'applicationname comes here', dataType: 'createApplicationGroupPermissions' });
                    }),
                    catchError(errorRes => {
                        //   this.toastr.showError('Please raise a ticket with tech support with the following information: ' + errorRes.error.error, 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to get Imagesource
     
    getApplicationImagesource = createEffect(() =>
     this.actions$.pipe(
         ofType(ApplicationAction.getImageSource),
         switchMap((action) => {                
             return this.http.get<any>(this.environment.config.endPointUrl + 'oes/appOnboarding/applications/'+action.applicationId+'/imagesource').pipe(
                 map(resdata => {
                     return ApplicationAction.loadImageSource({ imageSourceListData: resdata});
                 }),
                 catchError(errorRes => {
                     //this.toastr.showError('Imagesource not confiugred for this application ','Error');
                     return handleError(errorRes);
                 })
             );
         })
     )
 )

    // Effect to get groupPermission
     
    getGroupPermissions = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.getGroupPermissions),
        switchMap((action) => {                
            return this.http.get<any>(this.environment.config.endPointUrl + 'platformservice/v1/applications/'+action.applicationId+'/usergroups/permissions').pipe(
                map(resdata => {
                    return ApplicationAction.loadGroupPermissions({groupPermissionsListData: resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    ))

    // Effect to Update group permission

    updateApplicationGroupPermissions = createEffect(() =>
   this.actions$.pipe(
       ofType(ApplicationAction.updateGroupPermissions),
       switchMap((action) => {                
           return this.http.put<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/applications/'+action.applicationId+'/usergroups/permissions',action.groupPermissionsListData).pipe(
               map(resdata => {
                this.toastr.showSuccess("Group Permissions updated Successfully","Success");
                   return ApplicationAction.postGroupPermissions({ groupPermissionsListUpdatedData: resdata});
               }),
               catchError(errorRes => {
                   return handleError(errorRes);
               })
           );
       })
   ))

   // Below effect is use for delete application present in application
   deleteApplicationGroupPermissions = createEffect(() =>
   this.actions$.pipe(
       ofType(ApplicationAction.deleteGroupPermissions),
       switchMap((action) => {
           return this.http.delete<any>(this.environment.config.endPointUrl + 'oes/appOnboarding/applications/'+action.applicationId+'/grouppermissions').pipe(
               map(resdata => {
                  this.toastr.showSuccess('GroupPermissions deleted successfully!!', 'SUCCESS');
                   return ApplicationAction.groupPermissiondeletedSuccessfully();
               }),
               catchError(errorRes => {
                 //   this.toastr.showError('Application is not deleted due to: ' + errorRes.error.error, 'ERROR')
                   return handleError(errorRes);
               })
           );
       })
   )
)

    // Below effect is use for saved data in create application phase
    onUpdateExistApplicationData = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.updateApplication),
            withLatestFrom(this.store.select(fromFeature.selectApplication)),
            switchMap(([action, applicationState]) => {
                
                return this.http.put<CreateApplication>(this.environment.config.endPointUrl + 'dashboardservice/v2/application/' + action.applicationId, action.appData).pipe(
                    map(resdata => {
                       // return ApplicationAction.dataSaved({ applicationName: action.appData.name, dataType: 'updateApplication' });
                       this.toastr.showSuccess(action.appData.name + ' Updated Successfully','Success')
                       return ApplicationAction.updateApplicationDone();
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Please raise a ticket with tech support with the following information: ' + errorRes.error.error, 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    // Below effect is use for fetch data related to Application List page
    fetchAppListData = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.loadAppList),
            withLatestFrom(this.appStore.select('auth')),
            switchMap(([action, authState]) => {
                return this.http.get<ApplicationList>(this.environment.config.endPointUrl + 'platformservice/v1/users/' + authState.user + '/applications?permissionId=read').pipe(
                    map(resdata => {
                        return ApplicationAction.fetchAppList({ Applist: resdata });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('ApplicationList Data: ' + errorRes.error.error, 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    //Below effect is use to redirect to application onboardind page in create& edit phase
    apponboardingRedirect = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.loadApp, ApplicationAction.enableEditMode),
            tap(() => {
                this.router.navigate(['/setup/newApplication'])
            })
        ), { dispatch: false }
    )

    //Below effect is use to redirect to application dashboard page after successfull submission
    appdashboardRedirect = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.dataSaved),
            withLatestFrom(this.store.select(fromFeature.selectApplication)),
            tap(([actiondata, appOnboardingState]) => {
                if (actiondata.dataType === 'createApplication') {
                    this.toastr.showSuccess("Application '" + actiondata.applicationName + "' created successfully !!", 'SUCCESS')
                } else {
                    this.toastr.showSuccess("Application '" + actiondata.applicationName + "' updated successfully !!", 'SUCCESS')
                }

                this.router.navigate([appOnboardingState.parentPage]);
                this.store.dispatch(ApplicationAction.loadAppList());
                this.appStore.dispatch(AppDashboardAction.loadAppDashboard());
            })
        ), { dispatch: false }
    )

    //Below effect is use to refresh appDashboard list on delete of application
    refreshDashboard = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.appDeletedSuccessfully),
            tap((actiondata) => {
                this.appStore.dispatch(AppDashboardAction.loadAppDashboard());
            })
        ), { dispatch: false }
    )

    // Below effect is use for delete application present in application
    deleteApplication = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.appDelete),
            switchMap((action) => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/application/' + action.id).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(action.applicationName + ' is deleted successfully!!', 'SUCCESS');
                        return ApplicationAction.appDeletedSuccessfully({ index: action.index });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Application is not deleted due to: ' + errorRes.error.error, 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
    // Below effect is use for fetch supported features dropdown data.
    fetchSupportedFeatures = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.loadApp),
            switchMap(() => {
                return this.http.get<Pipeline>(this.environment.config.endPointUrl + 'platformservice/v1/featureList').pipe(
                    map(resdata => {
                        return ApplicationAction.fetchSupportedFeatures({ supportedFeaturesData: resdata['supportedFeatures'] });
                    }),
                    catchError(errorRes => {
                        return handleOESError(errorRes, 1);
                    })
                );
            })
        )
    )

    // Effect to save approval gate for visibility feature -------------------- This is not been used need to check this
    onSaveApprovalGate = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.saveApprovalGate),
            switchMap((action) => {
                return this.http.post<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates', action.approvalGateData).pipe(
                    map(resdata => {
                        return ApplicationAction.postSaveApprovalGate({ approvalGateSavedData: resdata });
                        //this.store.dispatch(ApplicationAction.getApprovalGates());
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to get
    getApprovalGates = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.getApprovalGates),
            switchMap((action) => {
                //return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates').pipe(
                return this.http.get('/assets/data/visibility/approvalGatesList.json').pipe(
                    map(resdata => {
                        return ApplicationAction.loadApprovalGates({ approvalGatesList: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to edit approval gate for visibility feature
    onEditApprovalGate = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.editApprovalGate),
            switchMap((action) => {
                return this.http.put<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates/' + action.gateId, action.gateDataToEdit).pipe(
                    map(resdata => {
                        this.toastr.showSuccess('Approval gate saved successfully','SUCCESS');
                        return ApplicationAction.postEditApprovalGate({ message: resdata });
                        //this.store.dispatch(ApplicationAction.getApprovalGates());
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to delete approval gate for visibility feature
    onDeleteApprovalGate = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.deleteApprovalGate),
            switchMap((action) => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates/' + action.gateId).pipe(
                    map(resdata => {
                        return ApplicationAction.postDeleteApprovalGate({ message: resdata });
                        //this.store.dispatch(ApplicationAction.getApprovalGates());
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to delete approval gate for visibility feature
    onDeleteServices = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.deleteService),
            switchMap((action) => {
                return this.http.delete<any>(this.environment.config.endPointUrl + `dashboardservice/v2/applications/${action.applicationId}/service/${action.serviceId}`).pipe(
                    map(resdata => {
                        return ApplicationAction.postDeleteService({ deleteServiceMessage: resdata });
                        //this.store.dispatch(ApplicationAction.getApprovalGates());
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    getApprovalGatesOfaService = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.getApprovalGatesOfaService),
            switchMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates?serviceId=' + action.serviceId).pipe(
                    map(resdata => {
                        return ApplicationAction.loadApprovalGatesOfaService({ approvalGatesListOfaService: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to get all tool connectors configured for this installation
    getConfiguredToolConnectorTypes = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.getConfiguredToolConnectorTypes),
            switchMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/toolConnectors/configuredConnectorTypes').pipe(
                    //return this.http.get('/assets/data/visibility/configuredToolConnectors.json').pipe(
                    map(resdata => {
                        return ApplicationAction.loadConfiguredToolConnectorTypes({ configuredToolConnectorTypes: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to delete  visibility Toold Connector
    onDeleteVisibilityToolConnector = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.deleteVisibilityToolConnector),
            switchMap((action) => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates/' + action.approvalGateId + '/toolConnectors/' + action.visibilityToolConnectorId).pipe(
                    map(resdata => {
                        return ApplicationAction.postDeleteVisibilityToolConnector({ deleteVisibilityToolConnectorMessage: resdata });
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to get all tool connector accounts for a particular connector type
    getAccountsForToolType = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.getAccountToolType),
            flatMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/toolConnectors/connectorTypes/' + action.connectorType).pipe(
                    //return this.http.get('/assets/data/visibility/accountsForToolConnectors.json').pipe(
                    map(resdata => {
                        
                        return ApplicationAction.loadAccountToolType({ accountsForToolType: resdata });
                    }, (error: any) => { 
                        console.log("Log erro: ", error);
        
                    }), 
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    //Effects to get all templates already created by the user for the selected conector type
    getTemplatesForTooltype = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.getTemplatesToolType),
            flatMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/toolConnectors/' + action.connectorType + '/templates').pipe(
                    //return this.http.get('/assets/data/visibility/templateForTooltype.json').pipe(
                    map(resdata => {
                        return ApplicationAction.loadTemplateToolType({ templatesForToolType: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    //Add new tool template 
    onSaveTooltemplate = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.saveTemplateForTooltype),
            switchMap((action) => {
                return this.http.post<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/visibilityToolTemplates', action.templateForToolTypeData).pipe(
                    map(resdata => {
                        return ApplicationAction.postSaveTemplateForTooltype({ templateForToolTypeSavedData: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    //Update tool template 
    onUpdateTooltemplate = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.updateTemplateForTooltype),
            switchMap((action) => {
                return this.http.put<any>(`${this.environment.config.endPointUrl}visibilityservice/v1/visibilityToolTemplates/${action.updatedTemplateForToolTypeData.id}`, action.updatedTemplateForToolTypeData).pipe(
                    map(resdata => {
                        return ApplicationAction.putSaveTemplateForTooltype({ templateForToolTypeSavedData: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    //Get Template Data
    onGetTooltemplate = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.getTemplateDataForTooltype),
            switchMap((action) => {
                return this.http.get<any>(`${this.environment.config.endPointUrl}visibilityservice/v1/visibilityToolTemplates/${action.templateId}`).pipe(
                    map(resdata => {
                        return ApplicationAction.loadTemplateDataForTooltype({ templateData: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    //Get Feature List for a Serice
    onGetServiceFeatureList = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.getFeaturesForAService),
            switchMap((action) => {
                return this.http.get<any>(`${this.environment.config.endPointUrl}platformservice/v1/services/${action.serviceId}/features`).pipe(
                    map(resdata => {
                        return ApplicationAction.loadFetauresForService({ serviceFeatureList: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
    ///dashboardservice/v2/visibility/service/feature/configuration


    // Below code is used to save the sapor configured data

    onSaveSaporData = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.saveSaporConfig),
            switchMap((action) => {
                return this.http.post<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/sapor/service/feature/configuration', action.saporConfigData, {observe: 'response'}).pipe(
                    map(resdata => {
                        if(resdata['status'] == 200){
                            this.toastr.showSuccess('Feature saved successfully','SUCCESS');
                        }else{
                            this.toastr.showError('Failed to save. Try again','ERROR');
                        }
                        return ApplicationAction.postSaveSaporConfig({ 'saporConfigSavedData': {'status': true} });                  

                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below code is used to save the sapor configured data

    onUpdateSaporData = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.updateSaporConfig),
            switchMap((action) => {
                return this.http.put<any>(this.environment.config.endPointUrl + 'oes/appOnboarding/applications/' + action.applicationId + '/services/' + action.serviceId, action.saporConfigData).pipe(
                    map(resdata => {
                        this.toastr.showSuccess('Updated Successfully', 'SUCCESS');
                        return ApplicationAction.postUpdateSaporConfig({ saporConfigSavedData: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to delete approval gate for visibility feature
    onDeleteSaporConfig = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.deleteSaporConfig),
            switchMap((action) => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/sapor/service/' + action.serviceId + '/application/' + action.applicationId + '/feature/configuration').pipe(
                    map(resdata => {
                        this.toastr.showSuccess('Deleted Successfully', 'SUCCESS');
                        return ApplicationAction.postDeleteSaporConfig({ message: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to get
    // Effect to get
    getSaporConfigDetails = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.getSaporConfig),
            switchMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'oes/appOnboarding/applications/' + action.applicationId + '/services/' + action.serviceId).pipe(
                    map(resdata => {
                        return ApplicationAction.loadSaporConfig({ saporConfigList: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    //Effects to save the selected template and tool connector for the approval gate
    onSaveToolconnectorwithTemplate = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.saveToolConnectorWithTemplate),
            switchMap((action) => {
                return this.http.put<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates/' + action.gateId + '/toolConnectors/' + action.connectorId + '/template', action.toolconnectorwithTemplateData).pipe(
                    map(resdata => {
                        this.toastr.showSuccess('Tool connector saved successfully!!', 'SUCCESS');
                        return ApplicationAction.postSaveToolConnectorWithTemplate({ toolconnectorwithTemplateSavedData: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    //Effect to save Visibility configuration for a service for the first time
    onSaveVisibilityFeature = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.saveVisibilityFeature),
            switchMap((action) => {
                return this.http.post<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/visibility/service/feature/configuration', action.approvalGateData).pipe(
                    map(resdata => {
                    if(resdata['id']){
                        this.toastr.showSuccess('Approval gate saved successfully','SUCCESS');
                        var statusResponse = {'status' : true};
                    }else{
                        this.toastr.showError('Failed to save Approval gate. Try again','ERROR');
                        var statusResponse = {'status' : false};
                    }
                        return ApplicationAction.postSaveVisibilityFeature({ visibilityFeatureSavedData: resdata });
                        //this.store.dispatch(ApplicationAction.getApprovalGates());
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    //Effects to get all connectors (along with the selected templates) already added for this approval gate
    getToolConnectorforaGate = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.getToolConnectorForaGate),
            flatMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates/' + action.gateId + '/toolConnectors').pipe(
                    map(resdata => {
                        return ApplicationAction.loadToolConnectorForaGate({ configuredToolConnectorData: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Effect to delete  visibility feature
    onDeleteVisibilityFeature = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.deleteVisibilityFeature),
            switchMap((action) => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/visibility/service/' + action.serviceId + '/feature/configuration/' + action.gateId).pipe(
                    map(resdata => {
                        return ApplicationAction.postDeleteVisibilityFeature({ deleteFeatureVisibilityMessage: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Error', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

// ****** DEPLOYMENT VERIFICATION EFFECTS START HERE ******* //

    //Effect to save logtemplate associate to application
///autopilot/api/v1/applications/{applicationId}/logTemplates
onSaveLogTemplate = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.saveLogTemplate),
        switchMap((action) => {
            return this.http.post<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+action.applicationId+'/logTemplates', action.logTemplateData).pipe(
                map(resdata => {
                    this.store.dispatch(ApplicationAction.getLogTemplateforaApplication({applicationId : action.applicationId}));
                    return ApplicationAction.savedLogTemplate({ savedLogTemplateData: {'templateName' : action.logTemplateData['templateName']}});
                
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Error', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

//Effects to get all log templates for a application
///autopilot/api/v1/applications/1/logTemplates
getLogTemplateforaApplication = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.getLogTemplateforaApplication),
        switchMap((action) => {                    
            return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+ action.applicationId+'/logTemplates').pipe(          
                map(resdata => {
                    return ApplicationAction.loadLogTemplateforaApplication({ logTemplatesofaApplication: resdata});
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Error', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

//Effect to save logtemplate associate to application
//POST /autopilot/api/v1/applications/1/metricTemplates?isEdit=false
onSaveMetricTemplate = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.saveMetricTemplate),
        switchMap((action) => {
            return this.http.post<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+action.applicationId+'/metricTemplates?isEdit=false', action.metricTemplateData).pipe(
                map(resdata => {
                    this.store.dispatch(ApplicationAction.getMetricTemplateforaApplication({applicationId : action.applicationId}));
                    return ApplicationAction.savedMetricTemplate({ savedMetricTemplateData: {"templateName" : action.metricTemplateData['templateName']}});                   
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Error', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

//Effects to get all log templates for a application
///autopilot/api/v1/applications/1/metricTemplates
getMetricTemplateforaApplication = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.getMetricTemplateforaApplication),
        switchMap((action) => {                    
            return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+ action.applicationId+'/metricTemplates').pipe(          
                map(resdata => {
                    return ApplicationAction.loadMetricTemplateforaApplication({ metricTemplatesofaApplication: resdata});
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Error', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

//Effect to save deployment verification feature or associate service to template
//dashboardservice/v2/autopilot/service/feature/configuration
onSaveDeploymentVerification = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.saveDeploymentVerificationFeature),
        switchMap((action) => {
            return this.http.post<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/autopilot/service/feature/configuration', action.templateServiceData,{observe: 'response'}).pipe(
                map(resdata => {
                    if(resdata['status'] == 200){
                        this.toastr.showSuccess('Feature saved successfully','SUCCESS');
                        var statusResponse = {'status' : true};
                    }else{
                        this.toastr.showError('Failed to save. Try again','ERROR');
                        var statusResponse = {'status' : false};
                    }
                    return ApplicationAction.postDeploymentVerificationFeature({ deploymentVerificationSavedData: statusResponse });                   
                }),
                catchError(errorRes => {
                    this.toastr.showError('Failed to save. Try again','ERROR');
                    return handleError(errorRes);
                })
            );
        })
    )
)

//dashboardservice/v2/autopilot/service/{serviceId}/application/{applicationId}/feature/configuration
// Effect to delete  visibility feature
onDeleteDeploymentVerificationFeature = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.deleteDeploymentVerificationFeature),
        switchMap((action) => {
            return this.http.delete<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/autopilot/service/' +action.serviceId + '/application/'+action.applicationId +'/feature/configuration').pipe(
                map(resdata => {
                    this.toastr.showSuccess('Deleted Successfully', 'SUCCESS');
                    return ApplicationAction.postDeleteDeploymentVerificationFeature({ deleteFeatureDeploymentVerificationMessage: resdata});                 
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Error', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

//Effects to get templates associated to a service
///autopilot/api/v1/applications/{applicationId}/service/{serviceId}/template
getTemplatesForaService = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.getTemplatesForaService),
        switchMap((action) => { 
            //return this.http.get('/assets/data/dv/templatesOfService.json').pipe(                   
            return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+action.applicationId+'/service/'+ action.serviceId).pipe(          
                map(resdata => {
                    return ApplicationAction.loadTemplatesForaService({ templatesForaService: resdata});
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Error', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

//Effects to get  details a log template
////GET -  /autopilot/api/v1/applications/{applicationId}/logTemplates/{logTemplateName}
getLogTemplateDetails = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.getLogTemplateDetails),
        switchMap((action) => {             
            return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+ action.applicationId +'/logTemplates/'+ action.templateName).pipe(          
                map(resdata => {
                    return ApplicationAction.loadLogTemplateDetails({ logTemplateDetails: resdata});
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Error', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

//Effects to get details a metric template
//GET  /autopilot/api/v1/applications/{applicationId}/metricTemplates/{metricTemplateName}
getMetricTemplateDetails = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.getMetricTemplateDetails),
        switchMap((action) => {  
            //return this.http.get('/assets/data/dv/apminfra-metric.json').pipe(    
            return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+ action.applicationId +'/metricTemplates/'+ action.templateName).pipe(          
                map(resdata => {
                    return ApplicationAction.loadMetricTemplateDetails({ metricTemplateDetails: resdata});
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Error', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

//Effects to get all log templates for a application
//PUT - autopilot/api/v1/applications/1/logTemplates/{logTemplateName}
onEditLogTemplate = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.editLogTemplate),
        switchMap((action) => {
            return this.http.put<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+action.applicationId+'/logTemplates/'+ action.templateName, action.logTemplateDataToEdit).pipe(
                map(resdata => {
                    return ApplicationAction.editedLogTemplate({ editedLogTemplateData: {"templateName" : action.templateName}});                
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Error', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

//Effect to save logtemplate associate to application
//POST /autopilot/api/v1/applications/1/metricTemplates?isEdit=true
onEditMetricTemplate = createEffect(() =>
    this.actions$.pipe(
        ofType(ApplicationAction.editMetricTemplate),
        switchMap((action) => {
            return this.http.post<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+action.applicationId+'/metricTemplates?isEdit=true', action.metricTemplateDataToEdit).pipe(
                map(resdata => {
                    return ApplicationAction.editedMetricTemplate({ editedMetricTemplateData: {"templateName" : action.templateName}});                   
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Error', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)


// ****** DEPLOYMENT VERIFICATION EFFECTS ENDS HERE ******* //

}
