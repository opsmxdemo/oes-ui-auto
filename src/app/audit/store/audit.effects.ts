import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuditAction from './audit.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import {environment} from '../../../environments/environment.prod'
import { NotificationService } from 'src/app/services/notification.service';
import { PipelineCount } from 'src/app/models/audit/pipelineCount.model';


//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(AuditAction.errorOccured({ errorMessage }));
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
    return of(AuditAction.errorOccured({ errorMessage }));
}

@Injectable()
export class AuditEffect {
    user: any;
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService
    ) { }

    // Below effect is use for fetch pipline count which is used in audit navigation.
    fetchPipeline = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.loadAudit),
            switchMap(() => {
                return this.http.get<PipelineCount>(environment.samlUrl+'oes/audit/pipelinescount').pipe(
                    map(resdata => {
                        return AuditAction.fetchPipelineCount({pipelineCount:resdata});
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!','ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch all pipline data which is used to display on select allPipeline.
    fetchAllPipeline = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.loadAudit),
            switchMap(() => {
                const params  =  new HttpParams()
                .set('isLatest','false')
                .set('isTreeView','true');
                return this.http.get(environment.samlUrl+'oes/audit/allDeployments',{params: params}).pipe(
                    map(resdata => {
                        return AuditAction.fetchAllPipeline({allPipelineData:resdata});
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
