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
               // let headers = new HttpHeaders().append('Authorization', 'Bearer 	eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ');
                // headers = headers.append('Authorization', 'Bearer 	eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ');
                // headers = headers.append('Access-Contruol-Allow-Origin', 'true');
                //   headers = headers.append('Accept-Encoding', 'gzip, deflate, br');
               // headers = headers.append('Accept-Language', 'en-US,en;q=0.9');
                //headers = headers.append('Connection', 'keep-alive');
                //headers = headers.append('Host', '40.78.28.87:8090');
              //  headers = headers.append('Origin', 'https://40.78.28.87:8161'); 
           //     headers = headers.append('Sec-Fetch-Mode', 'cors');
           //headers = headers.append('Access-Control-Allow-Origin','*')
      
                return this.http.get('https://40.78.28.87:8090/canaries/latestrun',{headers: new HttpHeaders().set('Authorization', 'Bearer 	eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ').set('Access-Control-Allow-Origin', 'https://40.78.28.87:8090') }).pipe(
                    map(resdata => {
                       // let headers = new HttpHeaders().set('Access-Control-Allow-Origin','*');
                       // let headers: HttpHeaders = new HttpHeaders();
                        
                        //resdata.append('Access-Control-Allow-Origin','*');
                        //headers.get('Access-Control-Allow-Origin');
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

   

}
