import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import * as MetricAnalysisdActions from './metric-analysis.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';


//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred in server';
    if (!errorRes.error) {
        return of(MetricAnalysisdActions.errorOccured({ errorMessage }));
    }
    switch (errorRes.status) {
        case 500:
            errorMessage = 'Server is down, Please contact to admin';
            break;
        case 404:
            errorMessage = errorRes.error.error;
            break;
        default:
            errorMessage = errorRes.error.error;
            break;
    }
    return of(MetricAnalysisdActions.errorOccured({ errorMessage }));
}

@Injectable()
export class MetricAnalysisEffect {
    user: any;
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

    // Below effect is use for fetch metricAnalysis initial data i.e, CanaryOutputData
    fetchHealthChartData = createEffect(() =>
        this.actions$.pipe(
            ofType(MetricAnalysisdActions.loadMetricAnalysis),
            switchMap((action) => {
                return this.http.get(this.environment.config.endPointUrl +'autopilot/cas/getCanaryOutputNew?canaryId='+action.canaryId+'&serviceId='+action.serviceId).pipe(
                    map(resdata => {
                       return MetricAnalysisdActions.fetchCanaryOutput({cararyData:resdata});
                    }),
                    catchError(errorRes =>{
                        this.toastr.showError(errorRes.error.message, 'Error')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
}
