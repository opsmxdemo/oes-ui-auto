import { Effect, ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as LayoutAction from './layout.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Menu } from 'src/app/models/layoutModel/sidenavModel/menu.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';


//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any,index:number) => {
    let errorData = {
        errorMessage:errorRes.error.error,
        index:index
    }
    
    return of(new LayoutAction.ServerError(errorData));
}

//below function is use to fetch error and return appropriate comments
const handleErrorMessage = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of((LayoutAction.ErrorResponse));
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
    return of((LayoutAction.ErrorResponse));
}



@Injectable()
export class LayoutEffect {
    user: any;
    constructor(public actions$: Actions<LayoutAction.LayoutActions>,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router,
        private environment: AppConfigService,
        public notification: NotificationService,

    ) { }

     // Below effect is use for fetch supported features. 
     @Effect()
     fetchSupportedFeatures = this.actions$.pipe(
         ofType(LayoutAction.LayoutActionTypes.LOADPAGE),
         switchMap(() => {
             return this.http.get<string>(this.environment.config.endPointUrl+'platformservice/v1/featureList').pipe(
                 map(resData => {
                     this.store.dispatch(new LayoutAction.ApiSuccess(1));
                     return new LayoutAction.SupportedFeatures(resData['configuredFeatures']);
                 }),
                 catchError(errorRes => {
                     //return handleError(errorRes,1);
                     //this.notification.showError("Issue in refreshing the usergroups","Error");
                     return handleErrorMessage(errorRes);

                 })
             );
         })
     );

      // Below effect is use to refresh the usergroups in gate
      @Effect()
      refreshUserGroups = this.actions$.pipe(
          ofType(LayoutAction.LayoutActionTypes.LOADPAGE),
          withLatestFrom(this.store.select('auth')),
          switchMap(([action,authState]) => {
              return this.http.put<string>(this.environment.config.endPointUrl+'platformservice/v1/users/'+ authState.user +'/usergroups/refresh',{}).pipe(
                  map(resData => {
                      this.store.dispatch(new LayoutAction.ApiSuccess(1));
                      return new LayoutAction.usergroupRefresh(resData);
                  }),
                  catchError(errorRes => {
                      //return handleError(errorRes,1);
                      this.notification.showError("Issue in refreshing the usergroups","Error");
                      return handleErrorMessage(errorRes);

                  })
              );
          })
      );

    // Below effect is use for fetch sidebar data. 
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(LayoutAction.LayoutActionTypes.LOADPAGE),
        switchMap(() => {
            return this.http.get<Menu>(this.environment.config.endPointUrl+'dashboardservice/v2/dynamicMenu').pipe(
                map(resData => {
                    return new LayoutAction.SideBarFetch(resData['menu']);
                }),
                catchError(errorRes => {
                    return handleError(errorRes,1);
                })
            );
        })
    );

   

    // Below effect is use to refresh the usergroups in gate
    @Effect()
    visibilityConfiguredCount = this.actions$.pipe(
        ofType(LayoutAction.LayoutActionTypes.LOADPAGE),
        withLatestFrom(this.store.select('auth')),
        switchMap(([action,authState]) => {
            return this.http.get<string>(this.environment.config.endPointUrl+'visibilityservice/v1/users/'+ authState.user +'/approvalGateInstances/activeCount').pipe(
                map(resData => {
                   // this.store.dispatch(new LayoutAction.ApiSuccess(1));
                    return new LayoutAction.ApprovalInstanceCount(resData['activeCount']);
                }),
                catchError(errorRes => {
                   // return handleError(errorRes,1);
                   this.notification.showError("Error in fetching visibilty active count", "Error");
                    return handleErrorMessage(errorRes);
                   
                })
            );
        })
    );

}
