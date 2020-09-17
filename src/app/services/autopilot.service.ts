
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppConfigService } from './app-config.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AutopiloService {
 
  endpointUrl: string = null;

  constructor(private httpClient: HttpClient,
              private environment: AppConfigService) {             
  }

  
  cancelCanaryRun(canaryId) {
    return this.httpClient.get(this.environment.config.endPointUrl +'autopilot/canaries/cancelRunningCanary?id='+ canaryId).pipe(
        catchError(this.handleError)
    );
   
}
handleError(error) {
  let errorMessage = '';
  if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
  } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      // this.notifications.showError('error',errorMessage);
  }
  return throwError(errorMessage);
}

}
