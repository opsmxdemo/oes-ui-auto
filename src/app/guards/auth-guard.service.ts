import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    // tslint:disable-next-line: no-shadowed-variable
    constructor(private Store: Store<fromApp.AppState>) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.Store.select('auth').pipe(map((authState: fromAuth.State) => {
          return authState.authenticated;
        })
        );
      }
}
