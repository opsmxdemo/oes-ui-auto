import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as OnboardingAction from './onBoarding.actions';
import * as AppDashboardAction from '../../application/application-dashboard/store/dashboard.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from 'src/app/models/applicationOnboarding/applicationList/applicationList.model';
import { NotificationService } from 'src/app/services/notification.service';
import { CreateAccount } from 'src/app/models/applicationOnboarding/createAccountModel/createAccount.model';
import Swal from 'sweetalert2';
import { AppConfigService } from 'src/app/services/app-config.service';

//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(OnboardingAction.errorOccured({ errorMessage }));
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
    return of(OnboardingAction.errorOccured({ errorMessage }));
}

@Injectable()
export class ApplicationOnBoardingEffect {
    user: any;
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

    // Below effect is use for fetch pipline dropdown data.
    fetchPipeline = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.loadApp, OnboardingAction.enableEditMode),
            switchMap(() => {
                return this.http.get<Pipeline>(this.environment.config.endPointUrl + 'oes/appOnboarding/pipelineTemplates').pipe(
                    map(resdata => {
                        return OnboardingAction.fetchPipeline({ pipelineData: resdata['data'] });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch cloudAccount dropdown data.
    // fetchCloudAccount = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(OnboardingAction.loadApp, OnboardingAction.enableEditMode),
    //         switchMap(() => {

    //             return this.http.get<CloudAccount>(this.environment.config.endPointUrl + 'oes/appOnboarding/cloudAccounts').pipe(
    //                 map(resdata => {
    //                     return OnboardingAction.fetchCloudAccount({ cloudAccount: resdata['data'] })
    //                 }),
    //                 catchError(errorRes => {
    //                     this.toastr.showError('Server Error !!', 'ERROR')
    //                     return handleError(errorRes);
    //                 })
    //             );
    //         })
    //     )
    // )

     // Below effect is use for fetch imageSource dropdown data.
     fetchImageSource = createEffect(() =>
     this.actions$.pipe(
         ofType(OnboardingAction.loadApp, OnboardingAction.enableEditMode),
         switchMap(() => {

             return this.http.get(this.environment.config.endPointUrl + 'oes/accountsConfig/getDockerAccounts').pipe(
                 map(resdata => {
                     return OnboardingAction.fetchImageSource({imageSource:resdata['data']});
                 }),
                 catchError(errorRes => {
                     this.toastr.showError('Server Error !!', 'ERROR')
                     return handleError(errorRes);
                 })
             );
         })
     )
 )


    // Below effect is use for fetch Application data on edit mode.
    onEditApplication = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.enableEditMode),
            switchMap(action => {
                return this.http.get<CreateApplication>(this.environment.config.endPointUrl + 'oes/appOnboarding/editApplication?applicationName=' + action.applicationName).pipe(
                    map(resdata => {

                        return OnboardingAction.fetchAppData({ appData: resdata })
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for saved data in create application phase
    onsavedCreateApplicationData = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.createApplication),
            switchMap(action => {
                return this.http.post<CreateApplication>(this.environment.config.endPointUrl + 'oes/appOnboarding/createApplication', action.appData).pipe(
                    map(resdata => {
                        return OnboardingAction.dataSaved();
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for saved data in create application phase
    onUpdateExistApplicationData = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.updateApplication),
            switchMap(action => {
                return this.http.put<CreateApplication>(this.environment.config.endPointUrl + 'oes/appOnboarding/updateApplication', action.appData).pipe(
                    map(resdata => {
                        return OnboardingAction.dataSaved();
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    // Below effect is use for fetch data related to Application List page
    fetchAppListData = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.loadAppList),
            switchMap(() => {
                return this.http.get<ApplicationList>(this.environment.config.endPointUrl + 'oes/appOnboarding/applicationList').pipe(
                    map(resdata => {
                        return OnboardingAction.fetchAppList({ Applist: resdata['data'] });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    //Below effect is use to redirect to application onboardind page in create& edit phase
    apponboardingRedirect = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.loadApp, OnboardingAction.enableEditMode),
            tap(() => {
                this.router.navigate(['/setup/newApplication'])
            })
        ), { dispatch: false }
    )

    //Below effect is use to redirect to application dashboard page after successfull submission
    appdashboardRedirect = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.dataSaved),
            withLatestFrom(this.store.select('appOnboarding')),
            tap(([actiondata, appOnboardingState]) => {
                this.toastr.showSuccess('Data saved successfully !!', 'SUCCESS')
                this.router.navigate([appOnboardingState.parentPage]);
                this.store.dispatch(OnboardingAction.loadAppList());
                this.store.dispatch(AppDashboardAction.loadAppDashboard());
            })
        ), { dispatch: false }
    )

    //Below effect is use to refresh appDashboard list on delete of application
    refreshDashboard = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.appDeletedSuccessfully),
            tap((actiondata) => {
                this.store.dispatch(AppDashboardAction.loadAppDashboard());
            })
        ), { dispatch: false }
    )

    //Below effect is use to redirect to application dashboard page after successfull submission
    accountsRedirect = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.accountDataSaved),
            withLatestFrom(this.store.select('appOnboarding')),
            tap(([actiondata, appOnboardingState]) => {
                this.toastr.showSuccess('Data saved successfully !!', 'SUCCESS')
                //this.store.dispatch(OnboardingAction.loadAccountList());
                this.router.navigate([appOnboardingState.accountParentPage]);
            })
        ), { dispatch: false }
    )

    // Below effect is use for saved data in create account phase
    onsavedCreateAccountData = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.createAccount),
            switchMap(action => {
                const params = new HttpParams()
                    .set('postData', action.postData)
                return this.http.post<CreateAccount>(this.environment.config.endPointUrl + 'oes/accountsConfig/addOrUpdateDynamicAccount', action.accountData, { params: params }).pipe(
                    map(resdata => {
                        // this.router.navigate([]);
                        return OnboardingAction.accountDataSaved();
                    }),
                    catchError(errorRes => {
                        //  this.toastr.showError('Server Error !!','ERROR')
                        this.toastr.showError('Error', errorRes);
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for update account 
    onsavedUpdateAccountData = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.updateAccount),
            switchMap(action => {
                const params = new HttpParams()
                .set('postData', action.postData)
                return this.http.put<CreateAccount>(this.environment.config.endPointUrl+ 'oes/accountsConfig/addOrUpdateDynamicAccount', action.accountData,{ params: params }).pipe(
                    map(resdata => {
                       // this.router.navigate([]);
                        return OnboardingAction.accountDataSaved();
                    }),
                    catchError(errorRes => {
                      //  this.toastr.showError('Server Error !!','ERROR')
                        this.toastr.showError('Error', errorRes);
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch data related to Accounts List page
    fetchDatasourcesListData = createEffect(() =>
    this.actions$.pipe(
        ofType(OnboardingAction.loadDatasourceList),
        switchMap(() => {
            return this.http.get<any>(this.environment.config.endPointUrl+'oes/accountsConfig/getAccounts').pipe(
                map(resdata => {
                    return OnboardingAction.fetchDatasourceList({DatasourceList:resdata['data']});
                }),
                catchError(errorRes => {
                    this.toastr.showError('Server Error !!','ERROR')
                    return handleError(errorRes);
                })
            );
        })
       )
   )

     // Below effect is use for fetch data related to Accounts List page
     fetchAccountListData = createEffect(() =>
     this.actions$.pipe(
         ofType(OnboardingAction.loadAccountList),
         switchMap(() => {
             return this.http.get<any>(this.environment.config.endPointUrl+'oes/accountsConfig/getDynamicAccounts').pipe(
                 map(resdata => {
                     return OnboardingAction.fetchAccountList({Accountlist:resdata['accounts']});
                 }),
                 catchError(errorRes => {
                     this.toastr.showError('Server Error !!','ERROR')
                     return handleError(errorRes);
                 })
             );
         })
        )
    )

    // Below effect is use for delete application present in application
    deleteApplication = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.appDelete),
            switchMap((action) => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'oes/appOnboarding/deleteApplication/' + action.applicationName).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(action.applicationName + ' is deleted successfully!!', 'SUCCESS')
                        return OnboardingAction.appDeletedSuccessfully({ index: action.index });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    // Below effect is use for delete Account .
    deleteAccountData = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.deleteAccount),
            switchMap(action => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'oes/accountsConfig/dynamicAccount/' + action.accountName).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(action.accountName + ' is deleted successfully!!', 'SUCCESS')
                        // return OnboardingAction.appDeletedSuccessfully({index:action.index});
                        return OnboardingAction.accountDeleted({ index: action.index })
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    // Below effect is use for delete datasource Account .
    deleteDatasourceData = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.deleteDatasourceAccount),
            switchMap(action => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'oes/accountsConfig/deleteAccount/' + action.accountName).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(action.accountName + ' is deleted successfully!!', 'SUCCESS')
                        // return OnboardingAction.appDeletedSuccessfully({index:action.index});
                        return OnboardingAction.DatasourceaccountDeleted({ index: action.index })
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    //Below effect is use to redirect to application onboardind page in create& edit phase
    accountRedirect = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.loadAccount),
            tap(() => {
                this.router.navigate(['/setup/newAccount'])
            })
        ), { dispatch: false }
    )

}
