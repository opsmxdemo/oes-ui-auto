
import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({providedIn:'root'})
export class TestService {
    rp:number;
    // tslint:disable-next-line: no-shadowed-variable
    constructor(
                private httpClient: HttpClient,
    ) { }


    getdummyapi() {
        return this.httpClient.get(environment.baseUrl+'canaries/getAppServices');
    }
}
