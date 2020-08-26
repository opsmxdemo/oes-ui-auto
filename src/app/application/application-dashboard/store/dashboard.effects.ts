import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as DashboardActions from './dashboard.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import Swal from 'sweetalert2';



//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(DashboardActions.errorOccured({ errorMessage }));
    }
    return of(DashboardActions.errorOccured({ errorMessage }));
}

@Injectable()
export class AppDashboardEffect {
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService,
    ) { }

    // Below effect is use for fetch application data present in appdashboard
    fetchappData = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.loadAppDashboard),
            withLatestFrom(this.store.select('auth')),
            switchMap(([action,authState]) => {
                return this.http.get(this.environment.config.endPointUrl + 'dashboardservice/v1/dashboard/'+ authState.user +'/applications').pipe(
                    map(resdata => {
                        return DashboardActions.fetchedAppData({appData:resdata});
                    }),
                    catchError(errorRes => {
                        let errorObj = {
                            errorMessage: errorRes.error.error,
                            index: 2
                        }
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch network chart data to display network graph
    fetchNetworkChartData = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.loadAppDashboard),
            switchMap(() => {
                return this.http.get('../../../assets/data/network-topology.json').pipe(
                    map(resdata => {
                       return DashboardActions.fetchNetworkChartData({networkChartData:resdata});
                    }),

                );
            })
        )
    )

      // Below effect is use for delete Account .
      deleteApplication = createEffect(() =>
      this.actions$.pipe(
          ofType(DashboardActions.deleteApplication),
          switchMap(action => {
              return this.http.delete<any>(this.environment.config.endPointUrl + 'dashboardservice/v1/application/' + action.applicationId).pipe(
                  map(resdata => {
                      this.toastr.showSuccess(action.applicationId + ' is deleted successfully!!', 'SUCCESS')
                      // return OnboardingAction.appDeletedSuccessfully({index:action.index});
                      Swal.fire(
                          'Deleted!',
                          'Your file has been deleted.',
                          'success'
                      )
                      return DashboardActions.applicationDeleted({ index: action.index })
                  }),
                  catchError(errorRes => {
                      this.toastr.showError('Server Error !!', 'ERROR')
                      return handleError(errorRes);
                  })
              );
          })
      )
  )

  //Below effect is use to redirect to error page while failing get application API
  errorRedirect = createEffect(() =>
  this.actions$.pipe(
      ofType(DashboardActions.errorOccured,DashboardActions.fetchedAppData),
      withLatestFrom(this.store.select('appDashboard')),
      tap(([actiondata, dashboardState]) => {
          if(dashboardState.errorMessage === null){
            this.router.navigate(['application']);
          }else{
            this.router.navigate(['error']);
          }
          
      })
  ), { dispatch: false }
)

   

}
