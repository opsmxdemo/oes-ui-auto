import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs/operators';
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
                return this.http.get('../../../assets/data/subchartrawdata.json').pipe(
                    map(resdata => {
                        return CdDashboardAction.fetchSubChartRawData({subChartRawData:resdata});
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
