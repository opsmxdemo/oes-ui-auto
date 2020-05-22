import { ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as PolicyAction from './policyManagement.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment.prod'
import { NotificationService } from 'src/app/services/notification.service';
import { PolicyTable } from 'src/app/models/policyManagement/policyTable.model';


//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(PolicyAction.errorOccured({ errorMessage }));
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
    return of(PolicyAction.errorOccured({ errorMessage }));
}

@Injectable()
export class PolicyEffect {
    user: any;
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        public toastr: NotificationService
    ) { }

    // Below effect is use for fetch Table data exist in dynamic and static section
    fetchTableData = createEffect(() =>
        this.actions$.pipe(
            ofType(PolicyAction.loadPolicy,PolicyAction.successfullSubmission,PolicyAction.deletedPolicySuccessfully),
            switchMap(() => {
                return this.http.get<PolicyTable[]>(environment.samlUrl + 'oes/policy/list').pipe(
                    map(resdata => {
                        if (resdata['status'] === 400) {
                            this.toastr.showError(resdata['response'].message, 'ERROR')
                            return PolicyAction.errorOccured({ errorMessage: resdata['response'].message });
                        } else if (resdata['status'] === 200) {
                            return PolicyAction.loadTableData({ TableData: resdata['response'] });
                        }
                    }),

                );
            })
        )
    )

    // Below effect is use for fetch endpoint Types from API
    fetchEndpointTypes = createEffect(() =>
        this.actions$.pipe(
            ofType(PolicyAction.loadPolicy),
            switchMap(() => {
                return this.http.get(environment.samlUrl + 'oes/policy/endpointType').pipe(
                    map(resdata => {
                        return PolicyAction.fetchEndpointType({ endpointType: resdata });
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

    // Below effect is use for fetch Policy data in edit and viewOnly mode
    fetchPolicyData = createEffect(() =>
        this.actions$.pipe(
            ofType(PolicyAction.editPolicy),
            switchMap((action) => {
                return this.http.get(environment.samlUrl + 'oes/policy/'+action.policyName).pipe(
                    map(resdata => {
                        if (resdata['status'] === 400) {
                            this.toastr.showError(resdata['response'].message, 'ERROR')
                            return PolicyAction.errorOccured({ errorMessage: resdata['response'].message });
                        } else if (resdata['status'] === 200) {
                            return PolicyAction.fetchedPolicyData({policyData:resdata['response']})
                        }
                    }),
                   
                );
            })
        )
    )

    // Below effect is use to post data to backend
    savePolicyData = createEffect(() =>
        this.actions$.pipe(
            ofType(PolicyAction.savePolicy),
            switchMap((action) => {
                return this.http.post<any>(environment.samlUrl + 'oes/policy/save', action.policyForm).pipe(
                    map(resdata => {
                        if (resdata['status'] === 400) {
                            this.toastr.showError(resdata['response'].message, 'ERROR');
                            return PolicyAction.successfullSubmission({policyData:action.policyForm,readonly:false,editMode:false,errorMode:true});
                        } else if (resdata['status'] === 200) {
                            this.toastr.showSuccess(resdata['response'].message, 'SUCCESS');
                            return PolicyAction.successfullSubmission({policyData:action.policyForm,readonly:true,editMode:false,errorMode:false});
                        }
                    }),

                );
            })
        )
    )

    // Below effect is use to post data to backend
    deletePolicy = createEffect(() =>
        this.actions$.pipe(
            ofType(PolicyAction.deletePolicy),
            switchMap((action) => {
                return this.http.delete<any>(environment.samlUrl + 'oes/policy/'+action.policyName).pipe(
                    map(resdata => {
                        if (resdata['status'] === 400) {
                            this.toastr.showError(resdata['response'].message, 'ERROR');
                            return PolicyAction.deletedPolicySuccessfully();
                        } else if (resdata['status'] === 200) {
                            this.toastr.showSuccess(resdata['response'].message, 'SUCCESS');
                            return PolicyAction.deletedPolicySuccessfully();
                        }
                    }),

                );
            })
        )
    )




}
