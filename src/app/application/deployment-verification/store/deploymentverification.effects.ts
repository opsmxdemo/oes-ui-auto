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
import * as LogAnalysisAction from '../log-analysis/store/log-analysis.actions';


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
                return this.http.get(this.environment.config.endPointUrl +'dashboardservice/v2/users/'+authState.user+'/applications/latest-canary').pipe(
                    map(resdata => {
                        this.store.dispatch(DeploymentActions.updateCanaryRun({canaryId: resdata['canaryId']}));
                        this.store.dispatch(DeploymentActions.loadApplicationHelath({ canaryId: resdata['canaryId'] }));
                        this.store.dispatch(DeploymentActions.loadServices({ canaryId: resdata['canaryId'] }));
                       return DeploymentActions.fetchLatestRun({canaryId:resdata['canaryId']});
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
           ofType(DeploymentActions.loadApplications),
           switchMap(() => {
               return this.http.get(this.environment.config.endPointUrl +'autopilot/canaries/getApplicationsDetails').pipe(
                   map(resdata => {
                       return DeploymentActions.fetchApplications({applicationList:resdata});
                   }),
                   catchError(errorRes => {
                     //  this.toastr.showError('Server Error !!','ERROR')
                       return handleError(errorRes);
                   })
               );
           })
          )
      )

      //for getting reclassification history

        fetchReclassificationHistory = createEffect(() =>
        this.actions$.pipe(
            ofType(DeploymentActions.fetchReclassificationHistoryData),
            switchMap((action) => {                    // return this.http.get('/assets/data/logsData.json').pipe(                    
                return this.http.get(this.environment.config.endPointUrl +'autopilot/logs/feedbackHistory?logTemplateName=' + action.logTemplateName +'&canaryId=' + action.canaryId + "&serviceId=" + action.serviceId).pipe(                  
                    map(resdata => {
                    return DeploymentActions.loadReclassificationHistoryData({reclassificationHistoryResults:resdata});
                    }),
                    catchError(errorRes => {
                        //this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
        )

       // Below effect is use for fetch applications
       fetchServiceListData = createEffect(() =>
       this.actions$.pipe(
           ofType(DeploymentActions.loadServices,LogAnalysisAction.reloadAfterRerun),
           switchMap((action) => {
               return this.http.get<any>(this.environment.config.endPointUrl +'autopilot/canaries/getServiceList?canaryId='+action.canaryId).pipe(
                   map(resdata => {
                        // this.store.dispatch(DeploymentActions.loadServiceInformation({ canaryId: action.canaryId, serviceId: resdata.services[0].serviceId}));
                       return DeploymentActions.fetchServices({servicesList:resdata});
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
        fetchApplicationHealth= createEffect(() =>
        this.actions$.pipe(
            ofType(DeploymentActions.loadApplicationHelath),
            switchMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl +'autopilot/canaries/getApplicationHealth?canaryId='+action.canaryId).pipe(
                    map(resdata => {
                        return DeploymentActions.fetchApplicationHelath({applicationHealthDetails:resdata});
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
             ofType(DeploymentActions.loadServiceInformation),
             switchMap((action) => {
                 return this.http.get<any>(this.environment.config.endPointUrl +'autopilot/canaries/getServiceInformation?canaryId=' + action.canaryId + '&serviceId='+ action.serviceId).pipe(
                     map(resdata => {
                         return DeploymentActions.fetchServiceInformation({serviceSummary:resdata});
                     }),
                     catchError(errorRes => {
                     //    this.toastr.showError('Server Error !!','ERROR')
                         return handleError(errorRes);
                     })
                 );
             })
            )
         )

          // Below effect is use for cancel the running canary
        cancelRunningCanaryRun= createEffect(() =>
        this.actions$.pipe(
            ofType(DeploymentActions.loadcancelRunningCanary),
            switchMap((action) => {
                return this.http.get<any>(this.environment.config.endPointUrl +'autopilot/canaries/cancelRunningCanary?id='+action.canaryId).pipe(
                    map(resdata => {
                        return DeploymentActions.fetchcancelRunningCanaryStatus({cancelRunningCanaryData:resdata});
                    }),
                    catchError(errorRes => {
                       // this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
           )
        )

        //The effect is used to fetch logs resulst based on each tab ( expected, ignore, baseline etc)
fetchManualTriggerResults = createEffect(() =>
    this.actions$.pipe(
        ofType(DeploymentActions.manualTriggerData),
        switchMap((action) => {
            // platform-service-ui change
            return this.http.post(this.environment.config.endPointUrl + 'autopilot/registerCanary', action.data).pipe(
                map(resdata => {
                    this.store.dispatch(DeploymentActions.updateCanaryRun({canaryId: resdata['canaryId']}));
                    this.store.dispatch(DeploymentActions.loadApplicationHelath({ canaryId: resdata['canaryId'] }));
                    this.store.dispatch(DeploymentActions.loadServices({ canaryId: resdata['canaryId'] }));
                    return DeploymentActions.fetchManualTriggerResults({ manualTriggerResponse: resdata });
                }),
                catchError(errorRes => {
                    this.toastr.showError('Manual Trigger Canary Error!', 'ERROR')
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

// Below effect is use for fetch applications
fetchServicesOfApplicationId = createEffect(() =>
    this.actions$.pipe(
        ofType(DeploymentActions.fetchServicesOfApplication),
        switchMap((action) => {
            return this.http.get(this.environment.config.endPointUrl +'dashboardservice/v2/applications/' + action.applicationId).pipe(
                map(resdata => {
                    return DeploymentActions.loadServicesOfApplication({servicesOfApplication:resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    )
)  


// Below effect is use for fetch applications
downloadLogsData = createEffect(() =>
    this.actions$.pipe(
        ofType(DeploymentActions.downloadDebugData),
        switchMap((action) => {
            return this.http.get(this.environment.config.endPointUrl +'autopilot/canaries/debugLogsData?id=' + action.canaryId).pipe(
                map(resdata => {
                    location.href = this.environment.config.endPointUrl +'autopilot/canaries/debugLogsData?id=' + action.canaryId;
                    return DeploymentActions.loadDownloadData({debugDataResponse:resdata});
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    )
) 

}
