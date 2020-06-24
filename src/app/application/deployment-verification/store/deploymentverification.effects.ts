import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
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
            switchMap(() => {   
                return this.http.get('https://40.78.28.87:8090/canaries/latestrun',{headers: new HttpHeaders().set('Authorization', 'Bearer 	eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ').set('Access-Control-Allow-Origin', 'https://40.78.28.87:8090') }).pipe(
                    map(resdata => {
                       return DeploymentActions.fetchLatestRun({canaryRun:resdata});
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
               return this.http.get<any>('https://40.78.28.87:8090/canaries/applicationNames', {headers: new HttpHeaders().set('Authorization', 'Bearer 	eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ').set('Access-Control-Allow-Origin', 'https://40.78.28.87:8090')}).pipe(
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
               return this.http.get<any>('https://40.78.28.87:8090/canaries/getServiceList?canaryId='+87, {headers: new HttpHeaders().set('Authorization', 'Bearer 	eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ').set('Access-Control-Allow-Origin', 'https://40.78.28.87:8090')}).pipe(
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
                return this.http.get<any>('https://40.78.28.87:8090/canaries/getApplicationHealth?canaryId='+87, {headers: new HttpHeaders().set('Authorization', 'Bearer 	eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ').set('Access-Control-Allow-Origin', 'https://40.78.28.87:8090')}).pipe(
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
                 return this.http.get<any>('https://40.78.28.87:8090/canaries/getServiceInformation?canaryId=' + action.canaryId + '&serviceId='+ action.serviceId, {headers: new HttpHeaders().set('Authorization', 'Bearer 	eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ').set('Access-Control-Allow-Origin', 'https://40.78.28.87:8090')}).pipe(
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

       

}
