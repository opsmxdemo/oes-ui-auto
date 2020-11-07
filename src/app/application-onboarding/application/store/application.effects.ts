import { ofType, createEffect, act } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError, withLatestFrom } from 'rxjs/operators';
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
                        return ApplicationAction.environmentDataSaved({ applicationName: 'action.environmentsData.name', dataType: 'createApplicationEnvironments' });
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
                     return ApplicationAction.loadEnvironments({ environmentsListData: resdata});
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
                   return ApplicationAction.postUpdateEnvironments({ environmentsListUpdatedData: resdata});
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
                return this.http.post<Environment>(this.environment.config.endPointUrl + 'dashboardservice/v2/applications/' + action.applicationId + '/usergroups/permissions', action.groupPermissionData).pipe(
                    map(resdata => {
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
           return this.http.delete<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/applications/'+action.applicationId+'/usergroups/permissions').pipe(
               map(resdata => {
                  this.toastr.showSuccess('GroupPermissions deleted successfully!!', 'SUCCESS');
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

    // Below effect is use for saved data in create application phase
    onUpdateExistApplicationData = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.updateApplication),
            withLatestFrom(this.store.select(fromFeature.selectApplication)),
            switchMap(([action, applicationState]) => {
                return this.http.put<CreateApplication>(this.environment.config.endPointUrl + 'dashboardservice/v2/application/' + applicationState.applicationId, action.appData).pipe(
                    map(resdata => {
                        return ApplicationAction.dataSaved({ applicationName: action.appData.name, dataType: 'updateApplication' });
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

    // Effect to save approval gate for visibility feature
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

    // Effect to get all tool connector accounts for a particular connector type
    getAccountsForToolType = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.getAccountToolType),
            switchMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/toolConnectors/connectorTypes/' + action.connectorType).pipe(
                    //return this.http.get('/assets/data/visibility/accountsForToolConnectors.json').pipe(
                    map(resdata => {
                        return ApplicationAction.loadAccountToolType({ accountsForToolType: resdata });
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
            switchMap((action) => {
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
    ///dashboardservice/v2/visibility/service/feature/configuration


    // Below code is used to save the sapor configured data

    onSaveSaporData = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationAction.saveSaporConfig),
            switchMap((action) => {
                return this.http.post<any>(this.environment.config.endPointUrl + 'dashboardservice/v2/sapor/service/feature/configuration', action.saporConfigData).pipe(
                    map(resdata => {
                        this.toastr.showSuccess('Saved Successfully', 'SUCCESS');
                        return ApplicationAction.postSaveSaporConfig({ saporConfigSavedData: resdata });
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
                return this.http.get<any>(this.environment.config.endPointUrl + 'oes/appOnboarding/applications/' + 309 + '/services/' + 298).pipe(
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
            switchMap((action) => {
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

}
