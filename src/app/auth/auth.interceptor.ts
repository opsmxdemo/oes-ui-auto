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
          const requrl = req.url;
          if(requrl.includes('/auth/user') || requrl.includes('oes')){
            const oesreq = req.clone({
              withCredentials: true
          });
          return next.handle(oesreq);
          }else{
            const autopilotreq = req.clone({
              setHeaders: {
                Authorization: 'Bearer 	eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ'
              }
          });
          return next.handle(autopilotreq);
          }
        })
       );
   }
}
