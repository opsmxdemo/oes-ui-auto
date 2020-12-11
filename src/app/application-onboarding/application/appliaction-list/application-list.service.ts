import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationListService {
  editMode: boolean;
  applicationName: string;
  applicationId: number;


  constructor(public http: HttpClient, public router: Router, public environment: AppConfigService) {
  }

  editApplicationAPI(applicationId){
           return this.http.get<any>(this.environment.config.endPointUrl + 'platformservice/v1/applications/' + applicationId);
  }

}
