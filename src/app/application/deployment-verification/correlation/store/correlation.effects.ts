import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError,withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import * as CorrelationActions from './correlation.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import * as fromFeature from '../../store/feature.reducer';


//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(CorrelationActions.errorOccured({ errorMessage }));
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
    return of(CorrelationActions.errorOccured({ errorMessage }));
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

    
    fetchUnxepectedClusters = createEffect(() =>
    this.actions$.pipe(
        ofType(CorrelationActions.fetchUnxepectedClusters),
        switchMap((action) => {                                       
            return this.http.get(this.environment.config.endPointUrl +'/autopilot/v1/correlation/log?riskAnalysisId=' + action.canaryId + '&serviceId=' + action.serviceId ).pipe(                  
                map(resdata => {
                   return CorrelationActions.loadUnxepectedClusters({unexpectedClusters:resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    )
)

    fetchLogLines = createEffect(() =>
    this.actions$.pipe(
        ofType(CorrelationActions.fetchLogLines),
        switchMap((action) => {                                       
            return this.http.get(this.environment.config.endPointUrl +'/autopilot/v1/correlation/log?riskAnalysisId=' + action.canaryId + '&serviceId=' + action.serviceId+ '&clusterId=' + action.clusterId ).pipe(                  
                map(resdata => {
                   return CorrelationActions.loadLogLines({logLines:resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    )
)

}
