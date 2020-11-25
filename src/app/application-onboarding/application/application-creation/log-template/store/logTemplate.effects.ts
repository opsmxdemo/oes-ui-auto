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

 // Below effect is use for fetch tags  data.
 fetchTags = createEffect(() =>
     this.actions$.pipe(
         ofType(ApplicationAction.loadCustomTags),
         switchMap((action) => {
             return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/' + action.applicationId + '/tags').pipe(
                 map(resdata => {
                     return ApplicationAction.fetchCustomTags({ tags: resdata });
                 }),
                 catchError(errorRes => {
                    // this.toastr.showError('Server Error !!', 'ERROR')
                     return handleError(errorRes);
                 })
             );
         })
     )
 )

 // Below effect is use for add new tag
 addTags = createEffect(() =>
 this.actions$.pipe(
     ofType(ApplicationAction.addCustomTags),
     switchMap(action => {
         
         return this.http.post<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+action.applicationId+'/tags', action.newtagData).pipe(
             map(resdata => {
                 this.toastr.showSuccess('Saved Successfully', 'SUCCESS');
                 this.store.dispatch(ApplicationAction.loadCustomTags({ applicationId: action.applicationId }));
                 return ApplicationAction.savedCustomTag({ savedTagResponse:resdata });
             }),
             catchError(errorRes => {
             //  this.toastr.showError('Please raise a ticket with tech support with the following information: ' + errorRes.error.error, 'ERROR')
                 return handleError(errorRes);
             })
         );
     })
 )
)

// Below effect is use for edit tag data 
editTags = createEffect(() =>
this.actions$.pipe(
    ofType(ApplicationAction.editCustomTags),
    switchMap(action => {
        
        return this.http.put<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/'+action.applicationId+'/tags/'+action.tagId, action.edittagData).pipe(
            map(resdata => {
                this.toastr.showSuccess('Saved Successfully', 'SUCCESS');
                this.store.dispatch(ApplicationAction.loadCustomTags({ applicationId: action.applicationId }));
                return ApplicationAction.savededitCustomTag({ savedEditTagResponse:resdata });
            }),
            catchError(errorRes => {
            //  this.toastr.showError('Please raise a ticket with tech support with the following information: ' + errorRes.error.error, 'ERROR')
                return handleError(errorRes);
            })
        );
    })
)
)

 // Below effect is use for delete tags  .
 deleteTags = createEffect(() =>
     this.actions$.pipe(
         ofType(ApplicationAction.deleteCustomTags),
         switchMap((action) => {
             return this.http.delete<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/' + action.applicationId + '/tags/'+action.tagId).pipe(
                 map(resdata => {
                this.toastr.showSuccess('Deleted Successfully', 'SUCCESS');
                    this.store.dispatch(ApplicationAction.loadCustomTags({ applicationId: action.applicationId }));
                     return ApplicationAction.fetchDeleteCustomTag({deleteTagResponse : resdata });
                 }),
                 catchError(errorRes => {
                    // this.toastr.showError('Server Error !!', 'ERROR')
                     return handleError(errorRes);
                 })
             );
         })
     )
 )

 // Below effect is use for gettingScoringAlgo  .
 fetchScoringAlgo = createEffect(() =>
     this.actions$.pipe(
         ofType(ApplicationAction.getScoringAlgo),
         switchMap((action) => {
             return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/scoring-algorithms' ).pipe(
                 map(resdata => {
                    
                     return ApplicationAction.fetchScoringAlgo({ scoringAlgoResponse : resdata });
                 }),
                 catchError(errorRes => {
                    // this.toastr.showError('Server Error !!', 'ERROR')
                     return handleError(errorRes);
                 })
             );
         })
     )
 )

 // Below effect is use for fetch cluster tags table data.
 fetchClusterTags = createEffect(() =>
     this.actions$.pipe(
         ofType(ApplicationAction.loadClusterTags),
         switchMap(() => {
             return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/getClusterTags').pipe(
                 map(resdata => {
                     return ApplicationAction.fetchClusterTags({ clusterTags: resdata });
                 }),
                 catchError(errorRes => {
                    // this.toastr.showError('Server Error !!', 'ERROR')
                     return handleError(errorRes);
                 })
             );
         })
     )
 )

 // Below effect is use for fetch cluster tags table data.
 fetchDataSourceResponseKey = createEffect(() =>
     this.actions$.pipe(
         ofType(ApplicationAction.fetchDataSourceResponseKey),
         switchMap((action) => {
             return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/logs/getDataSourceResponseKeys?accountName='+action.accountName).pipe(
                 map(resdata => {
                     return ApplicationAction.loadDataSourceResponseKey({responseKeys : resdata });
                 }),
                 catchError(errorRes => {
                    // this.toastr.showError('Server Error !!', 'ERROR')
                     return handleError(errorRes);
                 })
             );
         })
     )
 )

}
