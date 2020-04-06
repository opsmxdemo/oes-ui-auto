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
    return this.httpClient.get('https://137.117.94.95:8050/audit/getAllDeployments?isLatest=false&authToken=SESSION=YzFlY2MzZDYtY2ZhOC00NjU4LTk2Y2ItY2YwMmE3ZTExYWY5&isTreeView=true');
}

}