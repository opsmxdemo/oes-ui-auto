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
import { PolicyManagement } from 'src/app/models/policyManagement/policyManagement.model';


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

    // Below effect is use for fetch Tadle data exist in dynamic and static section
    fetchTableData = createEffect(() =>
        this.actions$.pipe(
            ofType(PolicyAction.loadPolicy),
            switchMap(() => {
                return this.http.get<PolicyTable[]>('../../../assets/data/policyManagement.json').pipe(
                    map(resdata => {
                        console.log('tabledata',resdata);
                        return PolicyAction.loadTableData({TableData:resdata});
                    }),
                    catchError(errorRes => {
                        this.toastr.showError('Server Error !!', 'ERROR')
                        return handleError(errorRes);
                    })
                );
            })
        )
    )

     // Below effect is use to post data to backend
     savePolicy = createEffect(() =>
     this.actions$.pipe(
         ofType(PolicyAction.savePolicy),
         switchMap((action) => {
             return this.http.post<PolicyManagement>(environment.samlUrl + 'oes/policy/save',action.policyForm).pipe(
                 map(resdata => {
                     return PolicyAction.loadTableData({TableData:resdata});
                 }),
                 catchError(errorRes => {
                     this.toastr.showError(errorRes.error.message, 'ERROR')
                     return handleError(errorRes);
                 })
             );
         })
     )
 )

    

}
