import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
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
export class LogTemplateEffect {
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromFeature.State>,
        public appStore: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

     // Below effect is use for fetch log accounts dropdown data.
     fetchLogAccounts = createEffect(() =>
     this.actions$.pipe(
         ofType(ApplicationAction.loadMonitoringAccountName),
         switchMap((action) => {
             return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/credentials?datasourceType='+action.monitoringSourceName).pipe(
                 map(resdata => {
                     return ApplicationAction.fetchMonitoringAccounts({logAccounts:resdata});
                 }),
                 catchError(errorRes => {
                     //this.toastr.showError('Server Error !!', 'ERROR');
                     return handleError(errorRes);
                 })
             );
         })
     )
 )

 // Below effect is use for fetch logtopics table data.
 fetchLogTopics = createEffect(() =>
     this.actions$.pipe(
         ofType(ApplicationAction.loadLogTopics),
         switchMap(() => {
             return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/defaultLogTemplate').pipe(
                 map(resdata => {
                     return ApplicationAction.fetchLogTopics({ logslist: resdata });
                 }),
                 catchError(errorRes => {
                    // this.toastr.showError('Server Error !!', 'ERROR')
                     return handleError(errorRes);
                 })
             );
         })
     )
 )

//  // Below effect is use for fetch logtopics table data.
//  fetchDatasources = createEffect(() =>
//      this.actions$.pipe(
//          ofType(ApplicationAction.loadSupportingDatasources),
//          switchMap(() => {
//              return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/supportedDatasources').pipe(
//                  map(resdata => {
//                      return ApplicationAction.fetchDatasources({ datasources: resdata });
//                  }),
//                  catchError(errorRes => {
//                      this.toastr.showError('Server Error !!', 'ERROR')
//                      return handleError(errorRes);
//                  })
//              );
//          })
//      )
//  )

}
