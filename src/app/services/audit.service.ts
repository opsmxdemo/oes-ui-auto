import { HttpClient,HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import {environment} from '../../environments/environment.prod';


@Injectable({providedIn:'root'})
export class AuditService{
    constructor(
        private httpClient: HttpClient,
) { }


/*getAllPipelines(token) {
    const params  =  new HttpParams()
        .set('isLatest','false')
        .set('isTreeView','true')
    return this.httpClient.get('https://137.117.94.95:8050/audit/getAllDeployments',{params: params});
}*/

getPipelineGroupCounts() {   
    //return this.httpClient.get('../../assets/data/auditGroupCount.json');
    return this.httpClient.get('http://137.117.94.95:8084/oes/audit/pipelinescount');
}

/*getSuccessfulPipelines() {
    return this.httpClient.get('../../assets/data/successfullPipelines.json');
}*/

getauditapplications() {    
    return this.httpClient.get('http://137.117.94.95:8084/oes/audit/applications');
}

getAllPipelines() {
    const params  =  new HttpParams()
        .set('isLatest','false')
        .set('isTreeView','true');
    return this.httpClient.get('http://137.117.94.95:8084/oes/audit/allDeployments',{params: params});
}


getAllModifiedPipelines() {
    const params  =  new HttpParams()
        .set('isTreeView','true');
    return this.httpClient.get('http://137.117.94.95:8084/oes/audit/pipelinesModified',{
        params :params
    });
}

getAllFailedPipelines() {
    const params  =  new HttpParams()
        .set('isTreeView','true');
    return this.httpClient.get('http://137.117.94.95:8084/oes/audit/failedPipelineDetails',{
        params :params
    });
}

	

getSuccessfulPipelines() {
    const params  =  new HttpParams()
        .set('isTreeView','true');
    return this.httpClient.get('http://137.117.94.95:8084/oes/audit/lastSuccessfulDeployments',{
        params :params
    });
}

}