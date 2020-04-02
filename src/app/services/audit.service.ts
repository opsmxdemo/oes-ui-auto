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
        .set('isTreeView','true')
        .set('authToken','SESSION=ZTNiZTc4OWItMTc0Ni00M2NiLWE5Y2QtNTJmNmMyYzBkYWU3');
    return this.httpClient.get('https://137.117.94.95:8050/audit/getAllDeployments',{
        params :params
    });
}

getSuccessfulPipelines() {
    const params  =  new HttpParams()
        .set('isTreeView','true')
        .set('authToken','SESSION=ZTNiZTc4OWItMTc0Ni00M2NiLWE5Y2QtNTJmNmMyYzBkYWU3');
    return this.httpClient.get('https://137.117.94.95:8050/audit/getLastSuccessfulDeployments',{
        params :params
    });
}

getAllModifiedPipelines() {
    const params  =  new HttpParams()
        .set('isTreeView','false')
        .set('authToken','SESSION=ZTNiZTc4OWItMTc0Ni00M2NiLWE5Y2QtNTJmNmMyYzBkYWU3');
    return this.httpClient.get('https://137.117.94.95:8050/audit/getPipelinesModified',{
        params :params
    });
}

getAllFailedPipelines() {
    const params  =  new HttpParams()
        .set('isTreeView','false')
        .set('authToken','SESSION=ZTNiZTc4OWItMTc0Ni00M2NiLWE5Y2QtNTJmNmMyYzBkYWU3');
    return this.httpClient.get('https://137.117.94.95:8050/audit/geFailedPipelineDetails',{
        params :params
    });
}

}