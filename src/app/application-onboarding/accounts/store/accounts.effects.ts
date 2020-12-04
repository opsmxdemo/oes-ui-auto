import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromFeature from '../../store/feature.reducer';
import * as fromApp from '../../../store/app.reducer';
import * as AccountsAction from './accounts.actions';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { CreateAccount } from 'src/app/models/applicationOnboarding/createAccountModel/createAccount.model';
import Swal from 'sweetalert2';
import { AppConfigService } from 'src/app/services/app-config.service';
import { of } from 'rxjs';

//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(AccountsAction.errorOccured({ errorMessage }));
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
    return of(AccountsAction.errorOccured({ errorMessage }));
}


@Injectable()
export class AccountsEffect {
    user: any;
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromFeature.State>,
        public appStore: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

    //Below effect is use to redirect to application dashboard page after successfull submission
    accountsRedirect = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountsAction.accountDataSaved),
            withLatestFrom(this.store.select(fromFeature.selectAccounts)),
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
            ofType(AccountsAction.createAccount),
            switchMap(action => {
                const params = new HttpParams()
                    .set('postData', action.postData)
                return this.http.post<CreateAccount>(this.environment.config.endPointUrl + 'oes/accountsConfig/addOrUpdateDynamicAccount', action.accountData, { params: params }).pipe(
                    map(resdata => {
                        // this.router.navigate([]);
                        return AccountsAction.accountDataSaved();
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

    updateAppAccount = createEffect(() =>
    this.actions$.pipe(
        ofType(AccountsAction.updateDynamicAccount),
        switchMap((action) => {                
            return this.http.put<any>(this.environment.config.endPointUrl + 'oes/accountsConfig/addOrUpdateDynamicAccount', action.updatedAccountData).pipe(
                map(resdata => {
                 this.toastr.showSuccess("updated Successfully","Success");
                    return AccountsAction.postUpdateDynamicAccount({dynamicAccountListData: resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    ))

  
     // Below effect is use for fetch data related to Accounts List page
     fetchAccountListData = createEffect(() =>
     this.actions$.pipe(
         ofType(AccountsAction.loadAccountList),
         switchMap(() => {
             return this.http.get<any>(this.environment.config.endPointUrl+'oes/accountsConfig/getDynamicAccounts').pipe(
                 map(resdata => {
                     return AccountsAction.fetchAccountList({Accountlist:resdata['accounts']});
                 }),
                 catchError(errorRes => {
                     return handleError(errorRes);
                 })
             );
         })
        )
    )

    // Below effect is use for delete Account .
    deleteAccountData = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountsAction.deleteAccount),
            switchMap(action => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'oes/accountsConfig/dynamicAccount/' + action.accountName).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(action.accountName + ' is deleted successfully!!', 'SUCCESS')
                        // return OnboardingAction.appDeletedSuccessfully({index:action.index});
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                        return AccountsAction.accountDeleted({ index: action.index })
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
    //Below effect is use to redirect to accounts page in create & edit phase
    accountRedirect = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountsAction.loadAccount),
            tap(() => {
                this.router.navigate(['/setup/newAccount'])
            })
        ), { dispatch: false }
    )

}
