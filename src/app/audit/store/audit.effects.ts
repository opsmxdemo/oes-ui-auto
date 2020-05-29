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
import { NotificationService } from 'src/app/services/notification.service';
import { PipelineCount } from 'src/app/models/audit/pipelineCount.model';
import { AppConfigService } from 'src/app/services/app-config.service';


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
        public toastr: NotificationService,
        private environment: AppConfigService
    ) { }

    // Below effect is use for fetch pipline count which is used in audit navigation.
    fetchPipeline = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.loadAudit),
            switchMap(() => {
                return this.http.get<PipelineCount>(this.environment.config.endPointUrl + 'oes/audit/pipelinescount').pipe(
                    map(resdata => {
                        return AuditAction.fetchPipelineCount({ pipelineCount: resdata });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch all Runningpipline data which is used to display on select Pipeline Execution.
    fetchAllPipeline = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.loadFinalData),
            switchMap(() => {
                const params = new HttpParams()
                    .set('isLatest', 'false')
                    .set('isTreeView', 'false');
                return this.http.get(this.environment.config.endPointUrl + 'oes/audit/allDeployments', { params: params }).pipe(
                    map(resdata => {
                        return AuditAction.fetchRuningPipeline({ allRunningPipelineData: resdata });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch all pipline exist in system which is used to display on select Pipeline.
    fetchModifiedPipeline = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.loadAudit),
            switchMap(() => {
                const params = new HttpParams()
                    .set('isTreeView', 'false');
                return this.http.get(this.environment.config.endPointUrl + 'oes/audit/pipelineconfig', { params: params }).pipe(
                    map(resdata => {
                        return AuditAction.fetchAllPipeline({ pipelineExist: resdata });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch all pipline data which is used to display on select allPipeline.
    fetchFailedPipeline = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.loadFinalData),
            switchMap(() => {
                const params = new HttpParams()
                    .set('isTreeView', 'true');
                return this.http.get(this.environment.config.endPointUrl + 'oes/audit/failedPipelineDetails', { params: params }).pipe(
                    map(resdata => {
                        return AuditAction.fetchFailedPipeline({ failedPipelineData: resdata });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch all pipline data which is used to display on select allPipeline.
    fetchLastSuccessfulDeployment = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.loadFinalData),
            switchMap(() => {
                const params = new HttpParams()
                    .set('isTreeView', 'true');
                return this.http.get(this.environment.config.endPointUrl + 'oes/audit/lastSuccessfulDeployments', { params: params }).pipe(
                    map(resdata => {
                        return AuditAction.fetchlastSuccessfulDeployments({ lastSuccessfulDeployment: resdata });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for post all filter data which will filter the data in backend and give filtered data in response
    postFilterData = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.postFilterData),
            switchMap((action) => {
                return this.http.post(this.environment.config.endPointUrl + 'oes/audit/'+action.relatedApi+'?isLatest=false&isTreeView=false',action.filter).pipe(
                    map(resdata => {
                        switch(action.relatedApi){
                            case 'pipelineconfig':
                                return AuditAction.fetchAllPipeline({ pipelineExist: resdata });
                            case 'allDeployments':
                                return AuditAction.fetchRuningPipeline({ allRunningPipelineData: resdata });
                        }
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch all Runningpipline data which is used to display on select Pipeline Execution.
    loadDataAfterClearedFilters = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.loadDataAfterClearFilter),
            switchMap((action) => {
                const params = new HttpParams()
                    .set('isLatest', 'false')
                    .set('isTreeView', 'false');
                return this.http.get(this.environment.config.endPointUrl + 'oes/audit/'+action.relatedApi, { params: params }).pipe(
                    map(resdata => {
                        switch(action.relatedApi){
                            case 'pipelineconfig':
                                return AuditAction.fetchAllPipeline({ pipelineExist: resdata });
                            case 'allDeployments':
                                return AuditAction.fetchRuningPipeline({ allRunningPipelineData: resdata });
                        }
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use to save customize filter in database
    saveFilterCall = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.saveFilterCall),
            switchMap((action) => {
                return this.http.post(this.environment.config.endPointUrl + 'oes/audit/filter/'+action.relatedApi+'save',action.saveFilterData).pipe(
                    map(resdata => {
                        this.toastr.showSuccess(action.saveFilterData['name']+' Successfully Saved','SUCCESS');
                        switch(action.relatedApi){
                            case 'pipelineconfig':
                                return AuditAction.fetchAllPipeline({ pipelineExist: resdata });
                            case 'pipeline':
                                return AuditAction.fetchRuningPipeline({ allRunningPipelineData: resdata });
                        }
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use to save customize filter in database
    deleteSavedFilter = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.deleteSavedFilter),
            switchMap((action) => {
                return this.http.delete(this.environment.config.endPointUrl + 'oes/audit/filter/delete/'+action.filtername).pipe(
                    map(resdata => {
                        if (resdata['status'] === 200) {
                            this.toastr.showSuccess(resdata['message'], 'SUCCESS')
                            if(action.isSame){
                                return AuditAction.loadDataAfterClearFilter({relatedApi:action.relatedApi});
                            } else {
                                return AuditAction.selectedFilterCall({filtername:action.appliedFilter,relatedApi:action.relatedApi});
                            }
                        }
                        
                    })
                );
            })
        )
    )

    // Below effect is use to fetched data of savedFilter from database
    fetchedSelectedSavedFilter = createEffect(() =>
        this.actions$.pipe(
            ofType(AuditAction.selectedFilterCall),
            switchMap((action) => {
                return this.http.get(this.environment.config.endPointUrl + 'oes/audit/'+action.relatedApi+'/'+action.filtername).pipe(
                    map(resdata => {
                        switch(action.relatedApi){
                            case 'pipelineconfig':
                                return AuditAction.fetchAllPipeline({ pipelineExist: resdata });
                            case 'pipeline':
                                return AuditAction.fetchRuningPipeline({ allRunningPipelineData: resdata });
                        }
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
