import { HttpClient,HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable, Subscriber } from 'rxjs';


@Injectable({providedIn:'root'})
export class AuditService{
    constructor(
        private httpClient: HttpClient,
) { }


getAllPipelines(parameters) {
    const params  =  new HttpParams()
        .set('isLatest','false')
        .set('authToken','SESSION=ZTNiZTc4OWItMTc0Ni00M2NiLWE5Y2QtNTJmNmMyYzBkYWU3');
    return this.httpClient.get('http://34.83.55.40:8050/audit/getAllDeployments',{
        params :params
    });
}

}