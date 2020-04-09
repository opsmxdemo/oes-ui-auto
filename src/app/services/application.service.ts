
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {environment} from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
    public childApplication: string;
    // tslint:disable-next-line: no-shadowed-variable
    constructor(private httpClient: HttpClient) { }
    getApplicationList() {
        return this.httpClient.get(environment.oesUrl + '/oes/applications').pipe(
            catchError(this.handleError)
        );
    }
    getServiceList(applicationName) {
        return this.httpClient.get(environment.oesUrl + '/oes/applications/' + applicationName + '/services').pipe(
            catchError(this.handleError)
        );
    }
    getReleaseList(applicationName) {
        return this.httpClient.get(environment.oesUrl + '/oes/applications/' + applicationName + '/releases').pipe(
            catchError(this.handleError)
        );
    }
    doNewRelease(applicationName) {
        return this.httpClient.get(environment.oesUrl + '/oes/applications/' + applicationName + '/releases/newRelease').pipe(
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
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }
}
