import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import * as LogAnalysisActions from './log-analysis.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';


//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(LogAnalysisActions.errorOccured({ errorMessage }));
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
    return of(LogAnalysisActions.errorOccured({ errorMessage }));
}

@Injectable()
export class LogAnalysisEffect {
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

    
    // Below effect is use for fetch latest run
        fetchLogAnalysisResults = createEffect(() =>
        this.actions$.pipe(
            ofType(LogAnalysisActions.loadLogResults),
            switchMap(() => { 
                return this.http.get(this.environment.config.autoPilotEndPointUrl +'canaries/logsData?id=542&serviceId=847').pipe(                  
                    map(resdata => {
                       //console.log("----effect-log-analysis",resdata);
                       return LogAnalysisActions.fetchLogsResults({logsResults:resdata});
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
