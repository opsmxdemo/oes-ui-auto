import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromFeature from '../../store/feature.reducer';
import * as DataSourceAction from './data-source.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import Swal from 'sweetalert2';
import { AppConfigService } from 'src/app/services/app-config.service';

//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(DataSourceAction.errorOccured({ errorMessage }));
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
    return of(DataSourceAction.errorOccured({ errorMessage }));
}

@Injectable()
export class DataSourceEffect {
    user: any;
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromFeature.State>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }
   
    // Below effect is use for fetch data related to Accounts List page
    fetchDatasourcesListData = createEffect(() =>
    this.actions$.pipe(
        ofType(DataSourceAction.loadDatasourceList),
        switchMap(() => {
            return this.http.get<any>(this.environment.config.endPointUrl+'oes/accountsConfig/getAccounts').pipe(
                map(resdata => {
                    return DataSourceAction.fetchDatasourceList({DatasourceList:resdata['data']});
                }),
                catchError(errorRes => {
                    this.toastr.showError('DataSources List Data: '+errorRes.error.error,'ERROR')
                    return handleError(errorRes);
                })
            );
        })
       )
   )


    // Below effect is use for fetch data related to supported DataSource
    fetchSupportedDatasources = createEffect(() =>
    this.actions$.pipe(
        ofType(DataSourceAction.loadDatasource),
        switchMap(() => {
            return this.http.get<any>(this.environment.config.endPointUrl+'autopilot/api/v1/supportedDatasources').pipe(
                map(resdata => {
                    return DataSourceAction.fetchSupportedDatasources({SupportedDataSource:resdata});
                }),
                catchError(errorRes => {
                    this.toastr.showError('Supported DataSources Data:'+errorRes.error.error,'ERROR')
                    return handleError(errorRes);
                })
            );
        })
       )
   )

    // Below effect is use for delete datasource Account .
    deleteDatasourceData = createEffect(() =>
        this.actions$.pipe(
            ofType(DataSourceAction.deleteDatasourceAccount),
            switchMap(action => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'oes/accountsConfig/deleteAccount/' + action.accountName).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(action.accountName + ' is deleted successfully!!', 'SUCCESS')
                        // return OnboardingAction.appDeletedSuccessfully({index:action.index});
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                        return DataSourceAction.DatasourceaccountDeleted({ index: action.index })
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('DataSource not deleted due to '+errorRes.error.error, 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    

}
