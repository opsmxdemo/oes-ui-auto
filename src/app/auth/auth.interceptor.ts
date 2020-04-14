import {Store} from '@ngrx/store';
import * as fromAuth from './store/auth.reducer';
import * as fromApp from '../store/app.reducer';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { take, switchMap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
   constructor(private store: Store<fromApp.AppState>) {}

   intercept(req: HttpRequest<any>, next: HttpHandler) {
       return this.store.select('auth').pipe(
         take(1),
        switchMap((authState: fromAuth.State) => {
            const copyreq = req.clone({
              withCredentials: true
          });
            return next.handle(copyreq);
        })
       );
   }
}
