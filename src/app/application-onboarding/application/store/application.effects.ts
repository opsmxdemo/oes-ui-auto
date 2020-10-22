import { ofType, createEffect } from '@ngrx/effects';
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
                return this.http.get<CreateApplication>(this.environment.config.endPointUrl + 'dashboardservice/v1/application/' + action.applicationId).pipe(
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
                return this.http.post<CreateApplication>(this.environment.config.endPointUrl + 'dashboardservice/v1/application', action.appData).pipe(
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
             return this.http.post<SaveApplication>(this.environment.config.endPointUrl + 'dashboardservice/v1/application', action.applicationData).pipe(
                 map(resdata => {
                     return ApplicationAction.dataSaved({ applicationName: action.applicationData.name, dataType: 'createApplication' });
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
   saveEnvironments = createEffect(() =>
   this.actions$.pipe(
       ofType(ApplicationAction.saveEnvironments),
       switchMap(action => {
           return this.http.post<Environment>(this.environment.config.endPointUrl + 'dashboardservice/v1/environments', action.environmentsData).pipe(
               map(resdata => {
                   return ApplicationAction.dataSaved({ applicationName: 'action.environmentsData.name', dataType: 'createApplication' });
               }),
               catchError(errorRes => {
                   this.toastr.showError('Please raise a ticket with tech support with the following information: ' + errorRes.error.error, 'ERROR')
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
                return this.http.put<CreateApplication>(this.environment.config.endPointUrl + 'dashboardservice/v1/application/' + applicationState.applicationId, action.appData).pipe(
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
                return this.http.delete<any>(this.environment.config.endPointUrl + 'dashboardservice/v1/application/' + action.id).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(action.applicationName + ' is deleted successfully!!', 'SUCCESS')
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
}
