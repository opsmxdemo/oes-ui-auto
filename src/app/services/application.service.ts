
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
    // tslint:disable-next-line: no-shadowed-variable
    constructor(private httpClient: HttpClient) { }
    getApplicationList() {
        return this.httpClient.get('https://35.238.22.177:8090/canaries/getAppServices').pipe(
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
