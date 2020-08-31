import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError,withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as DeploymentActions from './deploymentverification.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';


//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(DeploymentActions.errorOccured({ errorMessage }));
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
    return of(DeploymentActions.errorOccured({ errorMessage }));
}

@Injectable()
export class DeploymentVerificationEffect {
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
            ofType(DeploymentActions.loadLatestRun),
            withLatestFrom(this.store.select('auth')),
            switchMap(([action,authState]) => {   
                return this.http.get(this.environment.config.endPointUrl +'dashboardservice/v1/users/'+authState.user+'/applications/latest-canary').pipe(
                    map(resdata => {
                       return DeploymentActions.fetchLatestRun({canaryId:resdata['canaryId']});
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
       // Below effect is use for fetch applications
       fetchApplicationsListData = createEffect(() =>
       this.actions$.pipe(
           ofType(DeploymentActions.loadApplications),
           switchMap(() => {
               return this.http.get(this.environment.config.endPointUrl +'autopilot/canaries/getApplicationsDetails').pipe(
                   map(resdata => {
                       return DeploymentActions.fetchApplications({applicationList:resdata});
                   }),
                   catchError(errorRes => {
                       this.toastr.showError('Server Error !!','ERROR')
                       return handleError(errorRes);
                   })
               );
           })
          )
      )

       // Below effect is use for fetch applications
       fetchServiceListData = createEffect(() =>
       this.actions$.pipe(
           ofType(DeploymentActions.loadServices),
           switchMap((action) => {
               return this.http.get<any>(this.environment.config.endPointUrl +'autopilot/canaries/getServiceList?canaryId='+action.canaryId).pipe(
                   map(resdata => {
                       return DeploymentActions.fetchServices({servicesList:resdata});
                   }),
                   catchError(errorRes => {
                       this.toastr.showError('Server Error !!','ERROR')
                       return handleError(errorRes);
                   })
               );
           })
          )
       )

        // Below effect is use for fetch applications health details
        fetchApplicationHealth= createEffect(() =>
        this.actions$.pipe(
            ofType(DeploymentActions.loadApplicationHelath),
            switchMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl +'autopilot/canaries/getApplicationHealth?canaryId='+action.canaryId).pipe(
                    map(resdata => {
                        return DeploymentActions.fetchApplicationHelath({applicationHealthDetails:resdata});
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
           )
        )

         // Below effect is use for fetch selected service information
         fetchServiceInformation = createEffect(() =>
         this.actions$.pipe(
             ofType(DeploymentActions.loadServiceInformation),
             switchMap((action) => {
                 return this.http.get<any>(this.environment.config.endPointUrl +'autopilot/canaries/getServiceInformation?canaryId=' + action.canaryId + '&serviceId='+ action.serviceId).pipe(
                     map(resdata => {
                         return DeploymentActions.fetchServiceInformation({serviceSummary:resdata});
                     }),
                     catchError(errorRes => {
                         this.toastr.showError('Server Error !!','ERROR')
                         return handleError(errorRes);
                     })
                 );
             })
            )
         )

         //Below effect is use to redirect to application onboardind page in create& edit phase
    apponboardingRedirect = createEffect(() =>
    this.actions$.pipe(
        ofType(DeploymentActions.loadDeploymentApp),
        tap(() => {
            this.router.navigate(['/deploymentverification'])
        })
    ), { }
)

       

}
