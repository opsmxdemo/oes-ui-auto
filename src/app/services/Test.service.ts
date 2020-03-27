
import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';

@Injectable({providedIn:'root'})
export class TestService {
    // tslint:disable-next-line: no-shadowed-variable
    constructor(
                private httpClient: HttpClient,
    ) { }


    getdummyapi() {
        return this.httpClient.get('https://35.238.22.177:8090/canaries/getAppServices');
    }
}
