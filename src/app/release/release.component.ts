import { Component, OnInit, Input } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { environment } from 'src/environments/environment';
import { isTemplateMiddle } from 'typescript';
class ReleaseServices {
  serviceName = '';
  containerId = '';
}
class ReleaseEnvironment {
  keyName = '';
  valName = '';
}

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.less']
})
export class ReleaseComponent implements OnInit {
  public releaseData: any[] = [];
  public newReleaseData: any = null;
  public application: string;
  public releaseServicObj: ReleaseServices;
  public releaseEnvironmentObj: ReleaseEnvironment;
  public promoteData: any = {
    releaseName: '',
    source: '',
    serviceList: [],
    environmentList: []
  };
  showRelease = false;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.application = this.applicationService.childApplication;
    this.applicationService.getReleaseList(this.application).subscribe((response: any) => {
      console.log(response);
      this.releaseData = response;
    });
  }
  public newReleaseMethod() {
    this.showRelease = true;
    this.applicationService.doNewRelease(this.application).subscribe((response: any) => {
        response.services.forEach(item => {
        item.isChecked = false;
      });
        this.newReleaseData = response;
    });
  }
  public cancelRelease(){
    this.showRelease = false;
  }
  public getTabService(data, index) {
   // this.selectedServiceIndex = index;
  }
  public promoteRelease() {
    this.promoteData.serviceList = [];
    this.promoteData.environmentList = [];
    this.newReleaseData.services.forEach(item => {
         if (item.isChecked) {
        this.releaseServicObj = new ReleaseServices();
        this.releaseServicObj.serviceName = item.serviceName;
        this.releaseServicObj.containerId = item.latestImageId;
        this.promoteData.serviceList.push(this.releaseServicObj);
      }
         this.promoteData.source = this.newReleaseData.source;
    });
    this.newReleaseData.env.forEach(item => {
      this.releaseEnvironmentObj = new ReleaseEnvironment();
      this.releaseEnvironmentObj.keyName = item.key;
      this.releaseEnvironmentObj.valName = item.val;
      this.promoteData.environmentList.push(this.releaseEnvironmentObj);
    });
   // this.promoteData.source = JSON.stringify(this.newReleaseData.source);
    console.log(this.promoteData);
    this.applicationService.promoteRelease(this.promoteData).subscribe((response: any) => {
      console.log(response);
    });
  }

}
