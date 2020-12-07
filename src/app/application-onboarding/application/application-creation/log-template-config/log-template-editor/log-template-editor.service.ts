import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map, subscribeOn } from 'rxjs/operators';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LogTemplateConfigService } from '../log-template-config.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class LogTemplateEditorService extends LogTemplateConfigService {

  $dataReceived = new BehaviorSubject(false);

  constructor(public http: HttpClient, public router: Router, public toastr: NotificationService, public environment: AppConfigService) {
    super(http,router,toastr,environment);
  }

  initEditService() {
    if(LogTemplateConfigService.logTemplateData != undefined) {
      this.templateData = LogTemplateConfigService.logTemplateData;
      this.$dataReceived.next(true);
    } else {
      this.$dataReceived.next(false);
    }
  }

  updateJson(json) {
    LogTemplateConfigService.logTemplateData = json;
  }
  
}
