import { Component, OnInit, Input } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { environment } from 'src/environments/environment';
import { isTemplateMiddle } from 'typescript';
class ReleaseServices {
  serviceName = '';
  tag = '';
  image = '';
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
  @Input() releaseDataFromParent: any;
  public releaseData: any[] = [];
  public newReleaseData: any = null;
  public application: string;
  public releaseServicObj: ReleaseServices;
  public releaseEnvironmentObj: ReleaseEnvironment;
  public selectedServiceIndex: string;
  public spinnerService = false;
  public promoteData: any = {
    releaseName: '',
    source: '',
    serviceList: [],
    environmentList: []
  };
  showRelease = false;
  expandedIndex: number;
  ParentList: any[];
  ChildList: any[];

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.expandedIndex = -1;
    this.application = this.releaseDataFromParent[0].appName;
    this.releaseData = this.releaseDataFromParent;
  }
  public newReleaseMethod() {
    this.spinnerService = true;
    this.showRelease = true;
    this.applicationService.doNewRelease(this.application).subscribe((response: any) => {
        response.services.forEach(item => {
        item.isChecked = false;
      });
        this.newReleaseData = response;
        this.spinnerService = false;
    });
  }
  public cancelRelease(){
    this.showRelease = false;
  }
  public getChildDetails(data, index) {
    this.selectedServiceIndex = index;
  }
  public Collaps(index: number, childData: any) {
    this.expandedIndex = index === this.expandedIndex ? -1 : index;
    this.ChildList = childData.services;
    }
  public promoteRelease() {
    this.promoteData.serviceList = [];
    this.promoteData.environmentList = [];
    this.newReleaseData.services.forEach(item => {
         if (item.isChecked) {
        this.releaseServicObj = new ReleaseServices();
        this.releaseServicObj.serviceName = item.serviceName;
        this.releaseServicObj.tag = item.latestTag;
        this.releaseServicObj.image = item.image;
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
    this.applicationService.promoteRelease(this.promoteData,this.application).subscribe((response: any) => {
    });
  }

}
