import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()

// Below service is use to fetch endpointUrl from file exist in assets/config location and this endpoint is use to fetch data in OES app through api
export class AppConfigService {
    private appConfig;

    constructor (private injector: Injector) { }

    loadAppConfig() {
        let http = this.injector.get(HttpClient);

        return http.get('../../assets/config/app-config.json')
        .toPromise()
        .then(data => {
            this.appConfig = data;
        })
        .catch(error => {
            console.log("Error loading app-config.json, using envrionment file instead");
            this.appConfig = environment;
        })
    }

    get config() {
        return this.appConfig;
    }
}