import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { of } from 'rxjs';
import { withLatestFrom, switchMap, map, catchError } from 'rxjs/operators';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as Visibility from './visibility.actions';

//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(Visibility.errorOccured({ errorMessage }));
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
    return of(Visibility.errorOccured({ errorMessage }));
}

@Injectable()
export class VisibilityEffect {
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

    // Below effect is use for fetch applications
    fetchApplicationsListData = createEffect(() =>
        this.actions$.pipe(
            ofType(Visibility.loadApplications),
            switchMap(() => {
                console.log("this Message:");
                
                return this.http.get('/assets/data/visibility/applications.json').pipe( 
                    map(resdata => {
                        return Visibility.fetchApplications({ applicationList: resdata });
                    }),
                    catchError(errorRes => {
                        //  this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch Services
    fetchServiceListData = createEffect(() =>
        this.actions$.pipe(
            ofType(Visibility.loadServices),
            switchMap((action) => {
                // return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/canaries/getServiceList?canaryId=' + action.canaryId).pipe(
                return this.http.get('/assets/data/visibility/approvalGateInstances.json').pipe(
                    map(resdata => {
                        console.log("Services List: ", resdata);
                        
                        return Visibility.fetchServices({ servicesList: resdata });
                    }),
                    catchError(errorRes => {
                        // this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch Services
    fetchToolConnectors = createEffect(() =>
        this.actions$.pipe(
            ofType(Visibility.loadToolConnectors),
            switchMap((action) => {
                // return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/canaries/getServiceList?canaryId=' + action.canaryId).pipe(
                return this.http.get<any>('/assets/data/visibility/toolConnectors.json').pipe(
                    map(resdata => {
                        return Visibility.fetchToolConnectors({ toolConnectors: resdata });
                    }),
                    catchError(errorRes => {
                        // this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch Services
    fetchVisibilityData = createEffect(() =>
        this.actions$.pipe(
            ofType(Visibility.loadVisibilityData),
            switchMap((action) => {
                // return this.http.get<any>(this.environment.config.endPointUrl + 'autopilot/canaries/getServiceList?canaryId=' + action.canaryId).pipe(
                return this.http.get<any>('/assets/data/visibility/visibilityData.json').pipe(
                    map(resdata => {
                        return Visibility.fetchVisbilityData({ visibilityData: resdata });
                    }),
                    catchError(errorRes => {
                        // this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

}