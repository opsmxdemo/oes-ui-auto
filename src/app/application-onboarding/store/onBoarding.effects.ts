import { Effect, ofType, createEffect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as OnboardingAction from './onBoarding.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';


//below function is use to fetch error and return appropriate comments
const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error) {
        return of(OnboardingAction.errorOccured({errorMessage}));
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
    return of(OnboardingAction.errorOccured({errorMessage}));
}

@Injectable()
export class ApplicationOnBoardingEffect {
    user: any;
    constructor(public actions$: Actions,
        public http: HttpClient,
        public store: Store<fromApp.AppState>,
        public router: Router
    ) { }

    // Below effect is use for fetch pipline dropdown data.
    
    authLogin = createEffect(() =>
        this.actions$.pipe(
            ofType(OnboardingAction.loadApp),
            switchMap(() => {
                return this.http.get<Pipeline>('../../../assets/data/applicationOnboarding.json').pipe(
                    map(resdata => {
                        return OnboardingAction.fetchPipeline({pipelineData:resdata});
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                );
            })
        )
    )
    

}
