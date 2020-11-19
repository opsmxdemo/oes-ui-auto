import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError,withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import * as LogAnalysisActions from './log-analysis.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import * as fromFeature from '../../../deployment-verification/store/feature.reducer';


//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(LogAnalysisActions.errorOccured({ errorMessage }));
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
    return of(LogAnalysisActions.errorOccured({ errorMessage }));
}

@Injectable()
export class LogAnalysisEffect {
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService,
        public featureStore :Store<fromFeature.State>
    ) { }

    
// Below effect is use for fetch logs on unexpected events run
fetchLogAnalysisResults = createEffect(() =>
    this.actions$.pipe(
        ofType(LogAnalysisActions.loadLogResults),
        switchMap((action) => {                 
            return this.http.get(this.environment.config.endPointUrl +'autopilot/canaries/logsData?id=' + action.canaryId + '&serviceId=' + action.serviceId).pipe(                  
                map(resdata => {
                   return LogAnalysisActions.fetchLogsResults({logsResults:resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    )
)

fetchtimeAnalysisData = createEffect(() =>
    this.actions$.pipe(
        ofType(LogAnalysisActions.fetchTimeAnalysisGraphData),
        switchMap((action) => {                    // return this.http.get('/assets/data/logsData.json').pipe(                    
            return this.http.get(this.environment.config.endPointUrl +'autopilot/canaries/clusterTimeStamps?canaryId=' + action.canaryId + '&serviceId=' + action.serviceId + '&clusterId=' + action.clusterId + '&version=' + action.version).pipe(                  
                map(resdata => {
                   return LogAnalysisActions.loadTimeAnalysisGraphData({logTimeAnalysisResults:resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    )
)

//The effect is used to fetch logs resulst based on each tab ( expected, ignore, baseline etc)
fetchEventLogsResults = createEffect(() =>
    this.actions$.pipe(
        ofType(LogAnalysisActions.loadEventLogResults),
        switchMap((action) => {  
            return this.http.get(this.environment.config.endPointUrl +'autopilot/canaries/clustersByEvent?canaryId=' + action.canaryId + '&serviceId=' + action.serviceId + '&event=' + action.event).pipe(                  
                map(resdata => {
                   return LogAnalysisActions.fetchEventLogsResults({logsEventResults:resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    )
)


//The effect is used to fetch logs resulst based on each tab ( expected, ignore, baseline etc)
fetchRerunLogsResults = createEffect(() =>
    this.actions$.pipe(
        ofType(LogAnalysisActions.rerunLogs),
        withLatestFrom(this.store.select('auth')),
        switchMap(([action,authState]) => {             
            // platform-service-ui change
            return this.http.post(this.environment.config.endPointUrl +'autopilot/logs/updateFeedbackLogTemplate?logTemplateName=' + action.logTemplate + '&canaryId=' + action.canaryId + '&userName=' + authState.user + '&serviceId='+ action.serviceId, action.postData).pipe(                  
                map(resdata => {  
                   if(resdata['status']){
                    this.store.dispatch(LogAnalysisActions.reloadAfterRerun({canaryId:action.canaryId, serviceId:action.serviceId})); 
                    this.toastr.showSuccess(resdata['message'], 'SUCCESS')
                   }else if(!resdata['status']){
                    this.toastr.showError('Reclassification Failed. PLease try again', 'ERROR')  
                   }
                   return LogAnalysisActions.fetchRerunLogsResults({rerunResponse:resdata});
                }),
                catchError(errorRes => {
                    this.toastr.showError('Reclassification Failed. PLease try again', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

//for getting reclassification history

fetchReclassificationHistory = createEffect(() =>
    this.actions$.pipe(
        ofType(LogAnalysisActions.fetchReclassificationHistoryData),
        switchMap((action) => {                    // return this.http.get('/assets/data/logsData.json').pipe(                    
            return this.http.get(this.environment.config.endPointUrl +'autopilot/logs/feedbackHistory?logTemplateName=' + action.logTemplateName ).pipe(                  
                map(resdata => {
                   return LogAnalysisActions.loadReclassificationHistoryData({reclassificationHistoryResults:resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    )
)
    // Below effect is use for fetch logtopics table data.
    fetchLogTopics = createEffect(() =>
        this.actions$.pipe(
            ofType(LogAnalysisActions.loadLogTopics),
            switchMap(() => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/getClusterTags').pipe(
                    map(resdata => {
                        return LogAnalysisActions.fetchLogTopics({ logslist: resdata });
                    }),
                    catchError(errorRes => {
                        // this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

//The effect is used to fetch complete log line
fetchClusterLogsData = createEffect(() =>
    this.actions$.pipe(
        ofType(LogAnalysisActions.fetchClusterLogData),
        switchMap((action) => {  
            return this.http.get(this.environment.config.endPointUrl +'autopilot/canaries/clusterLogData?canaryId=' + action.canaryId + '&serviceId=' + action.serviceId + '&clusterId=' + action.clusterId + '&version=' + action.version).pipe(                  
                map(resdata => {
                   return LogAnalysisActions.loadClusterLogData({clusterLogs:resdata});
                }),
                catchError(errorRes => {
                    //this.toastr.showError('Server Error !!', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

fetchTags = createEffect(() =>
     this.actions$.pipe(
         ofType(LogAnalysisActions.loadCustomTags),
         switchMap((action) => {
             return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/api/v1/applications/' + action.applicationId + '/tags').pipe(
                 map(resdata => {
                     return LogAnalysisActions.fetchCustomTags({ tags: resdata });
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
