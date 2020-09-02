import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as CdDashboardAction from './cd-dashboard.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';


//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(CdDashboardAction.errorOccured({ errorMessage }));
    }
    switch (errorRes.error.message) {
        case 'Authentication Error':
            errorMessage = 'Invalid login credentials';
            break;
        default:
            errorMessage = 'Error Occurred';
            break;
    }
    return of(CdDashboardAction.errorOccured({ errorMessage }));
}

@Injectable()
export class CdDashboardEffect {
    user: any;
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

    // Below effect is use for fetch healthChartData present in dashboard screen
    fetchHealthChartData = createEffect(() =>
        this.actions$.pipe(
            ofType(CdDashboardAction.loadCdDashboard),
            switchMap(() => {
                return this.http.get('../../../assets/data/healthchart.json').pipe(
                    map(resdata => {
                       return CdDashboardAction.fetchHealthChartData({mainChartData:resdata});
                    }),

                );
            })
        )
    )

    // Below effect is use for fetch sub chart raw data i.e, no of widgets exist in cd dashboard page
    fetchSubChartRawData = createEffect(() =>
        this.actions$.pipe(
            ofType(CdDashboardAction.loadCdDashboard),
            switchMap(() => {
                return this.http.get(this.environment.config.endPointUrl + 'oes/dashboard/widgetRawData').pipe(
                    map(resdata => {
                        return CdDashboardAction.fetchSubChartRawData({widgetRawData:resdata});
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch sub chart data i.e, no of charts exist in widgets.
    fetchSubChartData = createEffect(() =>
        this.actions$.pipe(
            ofType(CdDashboardAction.loadSubChartData),
            mergeMap( action => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'oes/dashboard/widgetChartData?chartId='+action.subChartId+'&startTime=1495507760000&endTime=1595507892431').pipe(
                    map(resdata => {
                        return CdDashboardAction.fetchSubChartData({subChartData:resdata,index:action.index})
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
}
