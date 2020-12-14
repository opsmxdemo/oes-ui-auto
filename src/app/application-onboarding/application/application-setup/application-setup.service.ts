import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationSetupService {

  applicationDetails: any = {};
  showApplicationDetailsComp: boolean = true;
  showServiceDetailsComp: boolean;

  constructor() { }

}
