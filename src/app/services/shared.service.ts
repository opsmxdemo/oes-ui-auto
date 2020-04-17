
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class SharedService {

    constructor(private httpClient: HttpClient) { }

    //Below function is use to validate Application name exist or not through api.i.e, ApplicationComponent
    validateApplicationName(name: string, type: string) {
        return this.httpClient.get(environment.samlUrl+'oes/appOnboarding/nameCheck/'+name);
    }
}
