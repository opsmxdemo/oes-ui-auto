
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {NotificationService} from './notification.service';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
    endpointUrl:string = null;
    public childApplication: string;
    // tslint:disable-next-line: no-shadowed-variable
    constructor(public environment: AppConfigService, private httpClient: HttpClient, public notifications: NotificationService) {
        this.endpointUrl = environment.config.platFormEndPointUrl;
     }
    getApplicationList() {
        return this.httpClient.get(this.endpointUrl + 'oes/dashboard/applications').pipe(
            catchError(this.handleError)
        );
    }
    getServiceList(applicationId) {
        return this.httpClient.get(this.endpointUrl + 'platformservice/v1/dashboard/applications/' + applicationId).pipe(
            catchError(this.handleError)
        );
    }
    getServiceListDemo(applicationId) {
        return this.httpClient.get('http://137.117.94.95:8084/oes/dashboard/applications/'+ applicationId +'services').pipe(
            catchError(this.handleError)
        );
    }
    
    getReleaseList(applicationName) {
        return this.httpClient.get('http://137.117.94.95:8084/' + 'oes/dashboard/applications/' + applicationName + '/releases').pipe(
            catchError(this.handleError)
        );
    }
    doNewRelease(applicationName) {
        return this.httpClient.get('http://137.117.94.95:8084/' + 'oes/dashboard/applications/' + applicationName + '/releases/newRelease').pipe(
            catchError(this.handleError)
        );
    }
    promoteRelease(releaseData, applicationName) {
        return this.httpClient.post('http://137.117.94.95:8084/' + 'oes/dashboard/applications/' + applicationName + '/releases/newRelease', releaseData).pipe(
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
