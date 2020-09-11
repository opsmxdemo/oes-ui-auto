import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromFeature from '../../../../store/feature.reducer';
import * as fromApp from '../../../../../store/app.reducer';
import * as ApplicationAction from '../../../store/application.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { options } from 'fusioncharts';

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

@Injectable()
export class MetricTemplateEffect {
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromFeature.State>,
        public appStore: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

    //Below effect is use for fetch Accounts for custom datasources
    fetchAccountForCustomDataSource = createEffect(() =>        
        this.actions$.pipe(
            ofType(ApplicationAction.fetchAccountForCustomDataSource),
            withLatestFrom(this.store.select('auth')),
            switchMap(([action,authState]) => {               
                // const httpHeaders: HttpHeaders = new HttpHeaders({
                //     'x-spinner-user': authState.user 
                // }); ,{ headers: httpHeaders }               
                return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials?datasourceType='+action.datasource).pipe(
                    map(resdata => {
                        return ApplicationAction.loadAccountForCustomDataSource({ customDSAccounts: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
            
    //Below effect is use for fetch Accounts for APM datasources
    fetchAccountForAPMDataSource = createEffect(() =>        
        this.actions$.pipe(
            ofType(ApplicationAction.fetchAccountForAPMDataSource),
            switchMap((action) => {              
                return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials?datasourceType='+action.datasource).pipe(
                    map(resdata => {
                        return ApplicationAction.loadAccountForAPMDataSource({ APMDSAccounts: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

     //Below effect is use for fetch Accounts for INFRA datasources
     fetchAccountForINFRADataSource = createEffect(() =>        
     this.actions$.pipe(
         ofType(ApplicationAction.fetchAccountForInfraDataSource),
         switchMap((action) => {              
             return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials?datasourceType='+action.datasource).pipe(
                 map(resdata => {
                     return ApplicationAction.loadAccountForInfraDataSource({ InfraDSAccounts: resdata });
                 }),
                 catchError(errorRes => {
                     //this.toastr.showError('Server Error !!', 'ERROR')
                     return handleError(errorRes);
                 })
             );
         })
     )
    )

    //Below effect is use for fetch Applications for particular apm accounts
    fetchApplicationforAPM = createEffect(() =>        
    this.actions$.pipe(
        ofType(ApplicationAction.fetchApplicationForAPMAccounts),
        switchMap((action) => {              
            return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/canaries/getApplicationsOrServices?datasourceType='+action.sourceType+'&name='+action.account).pipe(
                map(resdata => {
                    return ApplicationAction.loadApplicationForAPMAccounts({ APMApplicationForAccounts: resdata });
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Server Error !!', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
        )
    )

     
    //Below effect is use for fetch generate cookbook
    fetchInfraGenerateCookbook = createEffect(() =>        
    this.actions$.pipe(
        ofType(ApplicationAction.fetchInfraGenerateCookbook),
        switchMap((action) => {              
            return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/canaries/generatecookbook?accountName='+ 
                action.account+ '&applicationName='+action.applicationName+ '&metricType='+action.metricType+ '&sourceType='+action.sourceType+ '&templateName='+action.templateName).pipe(
                map(resdata => {
                    return ApplicationAction.loadInfraGenerateCookbook({ INFRACookbook: resdata });
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Server Error !!', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
        )
    )

     //Below effect is use for fetch generate cookbook
     fetchAPMGenerateCookbook = createEffect(() =>        
     this.actions$.pipe(
         ofType(ApplicationAction.fetchAPMGenerateCookbook),
         switchMap((action) => {              
             return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/canaries/generatecookbook?accountName='+ 
                 action.account+ '&applicationName='+action.applicationName+ '&metricType='+action.metricType+ '&sourceType='+action.sourceType+ '&templateName='+action.templateName).pipe(
                 map(resdata => {
                     return ApplicationAction.loadAPMGenerateCookbook({ APMCookbook: resdata });
                 }),
                 catchError(errorRes => {
                     //this.toastr.showError('Server Error !!', 'ERROR')
                     return handleError(errorRes);
                 })
             );
         })
         )
     )
}
