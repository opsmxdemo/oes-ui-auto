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
        
    }
    return of(CorrelationActions.errorOccured({ errorMessage }));
}

@Injectable()
export class CorrelationEffect {
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
            return this.http.get(this.environment.config.endPointUrl +'autopilot/v1/correlation/log/' + action.canaryId + '/' + action.serviceId ).pipe(                  
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
allMetrics = createEffect(() =>
    this.actions$.pipe(
        ofType(CorrelationActions.allMetrics),
        switchMap((action) => {                                       
            return this.http.get(this.environment.config.endPointUrl +'autopilot/v1/correlation/metric/' + action.canaryId + '/' + action.serviceId ).pipe(                  
                map(resdata => {
                   return CorrelationActions.loadallMetrics({allMetricsData:resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    )
)

clusterData = createEffect(() =>
this.actions$.pipe(
    ofType(CorrelationActions.clusterData),
    switchMap((action) => {                                       
        return this.http.get(this.environment.config.endPointUrl +'autopilot/v1/correlation/log/' + action.canaryId + '/' + action.serviceId + '/'+action.clusterId+"?time="+action.ClickedTimeStamp).pipe(                  
            map(resdata => {
               return CorrelationActions.loadCluterData({clusterData:resdata});
            }),
            catchError(errorRes => {
                return handleError(errorRes);
            })
        );
    })
)
)

timeSeriesData = createEffect(() =>
    this.actions$.pipe(
        ofType(CorrelationActions.timeSeriesData),
        withLatestFrom(this.store.select('auth')),
        switchMap(([action,authState]) => {             
            // platform-service-ui change
            return this.http.post(this.environment.config.endPointUrl +'autopilot/v1/correlation/log/'  ,action.postData).pipe(                  
                map(resdata => {  
                   
                   return CorrelationActions.loadTimeseriesData({timeSeriesData:resdata});
                }),
                catchError(errorRes => {
                    this.toastr.showError('Reclassification Failed. PLease try again', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

metrictimeSeriesData = createEffect(() =>
    this.actions$.pipe(
        ofType(CorrelationActions.metrictimeSeriesData),
        withLatestFrom(this.store.select('auth')),
        switchMap(([action,authState]) => {             
            // platform-service-ui change
            return this.http.post(this.environment.config.endPointUrl +'autopilot/v1/correlation/metric/'  ,action.postData).pipe(                  
                map(resdata => {  
                   
                   return CorrelationActions.metricloadTimeseriesData({metrictimeSeriesData:resdata});
                }),
                catchError(errorRes => {
                    this.toastr.showError('Reclassification Failed. PLease try again', 'ERROR')
                    return handleError(errorRes);
                })
            );
        })
    )
)

    

}
