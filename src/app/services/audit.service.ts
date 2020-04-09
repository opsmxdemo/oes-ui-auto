import { HttpClient,HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import {environment} from '../../environments/environment.prod';


@Injectable({providedIn:'root'})
export class AuditService{
    constructor(
        private httpClient: HttpClient,
) { }


autheticate(){ 
    return this.httpClient.post(environment.auditUrl+'user/authenticate',{username: "OpsMxUser", password: "OpsMx@123"});
}

getAllPipelines(token) {
    const params  =  new HttpParams()
        .set('isLatest','false')
        .set('isTreeView','true')
        .set('authToken',token);
    return this.httpClient.get('https://137.117.94.95:8050/audit/getAllDeployments',{params: params});
}

getPipelineGroupCounts() {   
    return this.httpClient.get('../../assets/data/auditGroupCount.json');
}


}