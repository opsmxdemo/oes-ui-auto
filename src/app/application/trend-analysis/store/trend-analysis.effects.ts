import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { of } from 'rxjs';
import { withLatestFrom, switchMap, map, catchError } from 'rxjs/operators';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as TrendAnalysis from './trend-analysis.actions';

//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(TrendAnalysis.errorOccured({ errorMessage }));
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
    return of(TrendAnalysis.errorOccured({ errorMessage }));
}

@Injectable()
export class TrendAnalysisEffect {
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

    // Below effect is use for fetch latest run
    fetchlatestRunDetails = createEffect(() =>
        this.actions$.pipe(
            ofType(TrendAnalysis.loadLatestRun),
            withLatestFrom(this.store.select('auth')),
            switchMap(([action, authState]) => {
                return this.http.get(this.environment.config.endPointUrl + 'dashboardservice/v1/users/' + authState.user + '/applications/latest-canary').pipe(
                    map(resdata => {

                        console.log("Get Latest Run from effects!", resdata);
                        return TrendAnalysis.fetchLatestRun({ canaryId: resdata['canaryId'] });
                    }),
                    catchError(errorRes => {
                        //  this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
    // Below effect is use for fetch applications
    fetchApplicationsListData = createEffect(() =>
        this.actions$.pipe(
            ofType(TrendAnalysis.loadApplications),
            switchMap(() => {
                return this.http.get(this.environment.config.endPointUrl + 'autopilot/canaries/getApplicationsDetails').pipe(
                    map(resdata => {
                        return TrendAnalysis.fetchApplications({ applicationList: resdata });
                    }),
                    catchError(errorRes => {
                        //  this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    //for getting Application and service list 
    applicationAndServiceList = createEffect(() =>
        this.actions$.pipe(
            ofType(TrendAnalysis.loadApplicationData),
            switchMap((action) => {                    // return this.http.get('/assets/data/logsData.json').pipe(                    
                return this.http.get(this.environment.config.endPointUrl + 'autopilot/trend/getApplicationScoreTrend?applicationId=' + action.applicationId + '&startTime=' + action.startTime + "&endTime=" + action.endTime).pipe(
                    map(resdata => {
                        return TrendAnalysis.fetchApplicationData({ applicationAndServiceList: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    //for getting Error Graph (Issues) data for Logs 
    issuesLogsData = createEffect(() =>
        this.actions$.pipe(
            ofType(TrendAnalysis.loadServiceTrendLogs),
            switchMap((action) => {                    // return this.http.get('/assets/data/logsData.json').pipe(                    
                return this.http.get(this.environment.config.endPointUrl + 'autopilot/trend/getServiceLogClusterTrend?applicationId=' + action.applicationId + '&startTime=' + action.startTime + "&endTime=" + action.endTime + "&serviceId=" + action.serviceId).pipe(
                    map(resdata => {
                        return TrendAnalysis.fetchServiceTrendLogs({ issuesLogsData: resdata });
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch Services
    fetchServiceListData = createEffect(() =>
        this.actions$.pipe(
            ofType(TrendAnalysis.loadServices),
            switchMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/canaries/getServiceList?canaryId=' + action.canaryId).pipe(
                    map(resdata => {
                        return TrendAnalysis.fetchServices({ servicesList: resdata });
                    }),
                    catchError(errorRes => {
                        // this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )


    // Below effect is use for fetch applications health details
    fetchApplicationHealth = createEffect(() =>
        this.actions$.pipe(
            ofType(TrendAnalysis.loadApplicationHelath),
            switchMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/canaries/getApplicationHealth?canaryId=' + action.canaryId).pipe(
                    map(resdata => {
                        return TrendAnalysis.fetchApplicationHelath({ applicationHealthDetails: resdata });
                    }),
                    catchError(errorRes => {
                        //  this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
    // Below effect is use for fetch selected service information
    fetchServiceInformation = createEffect(() =>
        this.actions$.pipe(
            ofType(TrendAnalysis.loadServiceInformation),
            switchMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/canaries/getServiceInformation?canaryId=' + action.canaryId + '&serviceId=' + action.serviceId).pipe(
                    map(resdata => {
                        console.log("Load Service Informations: ", resdata);
                        
                        return TrendAnalysis.fetchServiceInformation({ serviceSummary: resdata });
                    }),
                    catchError(errorRes => {
                        //    this.toastr.showError('Server Error !!','ERROR') 
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
}