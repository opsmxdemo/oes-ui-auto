
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NotificationService} from './notification.service';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class TestService {
    endpointUrl:string = null;
    public childApplication: string;
    // tslint:disable-next-line: no-shadowed-variable
    constructor(public environment: AppConfigService, private httpClient: HttpClient, public notifications: NotificationService) {
        this.endpointUrl = environment.config.endPointUrl;
     }
     getUsers(){
        return this.httpClient.get('../../assets/data/treeview.json');
      }
    
}
