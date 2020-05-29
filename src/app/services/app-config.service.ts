import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable()

// Below service is use to fetch endpointUrl from file exist in assets/config location and this endpoint is use to fetch data in OES app through api
export class AppConfigService {
    private appConfig;

    constructor (private injector: Injector) { }

    loadAppConfig() {
        let http = this.injector.get(HttpClient);
        let notification = this.injector.get(NotificationService);

        return http.get('../../assets/config/app-config.json')
        .toPromise()
        .then(data => {
            debugger
            if(data['endPointUrl'] !== undefined){
                this.appConfig = data;
            }else {
                notification.showWarning("Endpoint is not specified in app-config file, using environment endpoint instead","Warning");
                this.appConfig = environment;
            }
            
        })
        .catch(error => {
            notification.showWarning("Error loading app-config.json, using environment endpoint instead","Warning");
            this.appConfig = environment;
        })
    }

    get config() {
        return this.appConfig;
    }
}