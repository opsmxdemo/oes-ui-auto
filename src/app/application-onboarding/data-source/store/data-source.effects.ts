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
import { CreateDataSource } from 'src/app/models/applicationOnboarding/dataSourceModel/createDataSourceModel';
import { EditDataSource } from 'src/app/models/applicationOnboarding/dataSourceModel/editDataSourceModel';

//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any, type:string) => {
    let errorMessage = 'An unknown error occurred';
    switch(type){
        case 'create':
            if (!errorRes.error) {
                return of(DataSourceAction.errorOccured({ errorMessage }));
            }
            return of(DataSourceAction.errorOccured({ errorMessage:errorRes.error.message }));
        case 'list':
            if (!errorRes.error) {
                return of(DataSourceAction.listErrorOccured({ errorMessage }));
            }
            return of(DataSourceAction.listErrorOccured({ errorMessage:errorRes.error.message }));
    }
    
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

    // Below effect is use for fetch OES data related to Accounts List page
    fetchOESDatasourcesListData = createEffect(() =>
        this.actions$.pipe(
            ofType(DataSourceAction.loadDatasourceList),
            switchMap(() => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'oes/accountsConfig/getAccounts').pipe(
                    map(resdata => {
                        return DataSourceAction.fetchDatasourceList({ DatasourceList: resdata });
                    }),
                );
            })
        )
    )

    // Below effect is use for fetch AP data related to Accounts List page
    fetchAPDatasourcesListData = createEffect(() =>
        this.actions$.pipe(
            ofType(DataSourceAction.loadDatasourceList),
            switchMap(() => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials').pipe(
                    map(resdata => {
                        return DataSourceAction.fetchDatasourceList({ DatasourceList: resdata });
                    }),
                );
            })
        )
    )


    // Below effect is use for fetch data related to DataSource
    fetchSupportedDatasources = createEffect(() =>
        this.actions$.pipe(
            ofType(DataSourceAction.loadDatasource),
            switchMap(() => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'dashboardservice/v1/datasources').pipe(
                    map(resdata => {
                        return DataSourceAction.fetchSupportedDatasources({ SupportedDataSource: resdata });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('DataSources Data:' + errorRes.error.error, 'ERROR')
                        return handleError(errorRes,'create');
                    })
                );
            })
        )
    )

    // Below effect is use for create APDataSource Account .
    createAPDatasource = createEffect(() =>
        this.actions$.pipe(
            ofType(DataSourceAction.createAPDatasources),
            switchMap(action => {
                return this.http.post<CreateDataSource>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials', action.CreatedDataSource).pipe(
                    map(resdata => {
                        this.toastr.showSuccess('Datasource "'+action.CreatedDataSource.name+'" is created successfully','Success');
                        this.store.dispatch(DataSourceAction.loadDatasourceList());
                        return DataSourceAction.successResponse();
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Datasource "'+action.CreatedDataSource.name+'" is not created due to: '+errorRes.error.message, 'ERROR')
                        return handleError(errorRes,'create');
                    })
                );
            })
        )
    )

    // Below effect is use for create OESDataSource Account .
    createOESDatasource = createEffect(() =>
        this.actions$.pipe(
            ofType(DataSourceAction.createOESDatasources),
            switchMap(action => {
                return this.http.post<CreateDataSource>(this.environment.config.endPointUrl + 'oes/accountsConfig/saveAccount', action.CreatedDataSource).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(resdata['message'],'Success');
                        this.store.dispatch(DataSourceAction.loadDatasourceList());
                        return DataSourceAction.successResponse();
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Datasource "'+action.CreatedDataSource.name+'" is not created due to: '+errorRes.error.message, 'ERROR')
                        return handleError(errorRes,'create');
                    })
                );
            })
        )
    )

    // Below effect is use for update APDataSource Account .
    updateAPDatasource = createEffect(() =>
        this.actions$.pipe(
            ofType(DataSourceAction.updateAPDatasources),
            switchMap(action => {
                return this.http.put<EditDataSource>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials/'+action.UpdatedDataSource.id, action.UpdatedDataSource).pipe(
                    map(resdata => {
                        this.toastr.showSuccess('Datasource "'+action.UpdatedDataSource.name+'" is updated successfully','Success');
                        this.store.dispatch(DataSourceAction.loadDatasourceList());
                        return DataSourceAction.updatesuccessResponse();
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Datasource "'+action.UpdatedDataSource.name+'" is not updated due to: '+errorRes.error.message, 'ERROR')
                        return handleError(errorRes,'create');
                    })
                );
            })
        )
    )

    // Below effect is use for update OESDataSource Account .
    updateOESDatasource = createEffect(() =>
        this.actions$.pipe(
            ofType(DataSourceAction.updateOESDatasources),
            switchMap(action => {
                return this.http.put<EditDataSource>(this.environment.config.endPointUrl + 'oes/accountsConfig/updateAccount/'+ action.UpdatedDataSource.id, action.UpdatedDataSource).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(resdata['message'],'Success');
                        this.store.dispatch(DataSourceAction.loadDatasourceList());
                        return DataSourceAction.updatesuccessResponse();
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Datasource "'+action.UpdatedDataSource.name+'" is not updated due to: '+errorRes.error.message, 'ERROR')
                        return handleError(errorRes,'create');
                    })
                );
            })
        )
    )

    // Below effect is use for delete datasource Account .
    deleteOESDatasourceData = createEffect(() =>
        this.actions$.pipe(
            ofType(DataSourceAction.deleteOESDatasourceAccount),
            switchMap(action => {
                return this.http.delete<any>(this.environment.config.endPointUrl + 'oes/accountsConfig/deleteAccount/?accountName=' + action.accountName).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(action.accountName + ' is deleted successfully!!', 'SUCCESS')
                        return DataSourceAction.DatasourceaccountDeleted({ index: action.index })
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('DataSource not deleted due to ' + errorRes.error.message, 'ERROR')
                        return handleError(errorRes,'list');
                    })
                );
            })
        )
    )

     // Below effect is use for delete datasource Account .
     deleteAPDatasourceData = createEffect(() =>
     this.actions$.pipe(
         ofType(DataSourceAction.deleteAPDatasourceAccount),
         switchMap(action => {
             return this.http.delete<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials/' + action.id).pipe(
                 map(resdata => {
                     this.toastr.showSuccess(action.accountName + ' is deleted successfully!!', 'SUCCESS')
                     return DataSourceAction.DatasourceaccountDeleted({ index: action.index })
                 }),
                 catchError(errorRes => {
                     this.toastr.showError('DataSource not deleted due to ' + errorRes.error.message, 'ERROR')
                     return handleError(errorRes,'list');
                 })
             );
         })
     )
 )



}
