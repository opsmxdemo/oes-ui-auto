import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as OnboardingAction from './onBoarding.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import {environment} from '../../../environments/environment.prod'
import { ApplicationList } from 'src/app/models/applicationOnboarding/applicationList/applicationList.model';
import { NotificationService } from 'src/app/services/notification.service';
import { CreateAccount } from 'src/app/models/applicationOnboarding/createAccountModel/createAccount.model';
import Swal from 'sweetalert2';

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
        public toastr: NotificationService
    ) { }

    // Below effect is use for fetch pipline dropdown data.
    fetchPipeline = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.loadApp, OnboardingAction.enableEditMode),
            switchMap(() => {
                return this.http.get<Pipeline>(environment.samlUrl+'oes/appOnboarding/pipelineTemplates').pipe(
                    map(resdata => {
                        return OnboardingAction.fetchPipeline({ pipelineData: resdata['data'] });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch cloudAccount dropdown data.
    fetchCloudAccount = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.loadApp, OnboardingAction.enableEditMode),
            switchMap(() => {
                return this.http.get<CloudAccount>(environment.samlUrl+'oes/appOnboarding/cloudAccounts').pipe(
                    map(resdata => {
                        return OnboardingAction.fetchCloudAccount({cloudAccount:resdata['data']})
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!','ERROR')
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
                return this.http.get<CreateApplication>(environment.samlUrl+'oes/appOnboarding/editApplication?applicationName=' + action.applicationName).pipe(
                    map(resdata => {
                        return OnboardingAction.fetchAppData({ appData: resdata })
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!','ERROR')
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
                return this.http.post<CreateApplication>(environment.samlUrl+'oes/appOnboarding/createApplication', action.appData).pipe(
                    map(resdata => {
                        return OnboardingAction.dataSaved();
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!','ERROR')
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
                return this.http.get<ApplicationList>(environment.samlUrl+'oes/appOnboarding/applicationList').pipe(
                    map(resdata => {
                        return OnboardingAction.fetchAppList({Applist:resdata['data']});
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!','ERROR')
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
            tap(([actiondata,appOnboardingState]) => {
                this.toastr.showSuccess('Data saved successfully !!','SUCCESS')
                this.router.navigate([appOnboardingState.parentPage]);
                this.store.dispatch(OnboardingAction.loadAppList());
            })
        ), { dispatch: false }
    )

    // Below effect is use for saved data in create account phase
    onsavedCreateAccountData = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.createAccount),
            switchMap(action => {
                return this.http.post<CreateAccount>(environment.samlUrl+'/oes/addOrUpdateAccount', action.accountData).pipe(
                    map(resdata => {
                        return OnboardingAction.dataSaved();
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
             return this.http.get<any>('../../../assets/data/accountList.json').pipe(
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

     // Below effect is use for delete Account .
     deleteAccountData = createEffect(() =>
     this.actions$.pipe(
         ofType(OnboardingAction.deleteAccount),
         switchMap(action => {
             return this.http.get<any>(environment.samlUrl+'oes/getDynamicAccounts/?accountName=' + action.accountName).pipe(
                 map(resdata => {
                     return OnboardingAction.accountDeleted();
                     Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                      )
                 }),
                 catchError(errorRes => {
                     this.toastr.showError('Server Error !!','ERROR')
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
