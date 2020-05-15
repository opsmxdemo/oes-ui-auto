import { Component, OnInit, Input } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { environment } from 'src/environments/environment';
import { isTemplateMiddle, StringLiteral } from 'typescript';
import { NotificationService } from '../services/notification.service';
class ReleaseServices {
  serviceName = '';
  tag = '';
  image = '';
}
class ReleaseEnvironment {
  key = '';
  val = '';
}

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.less']
})
export class ReleaseComponent implements OnInit {
  @Input() releaseDataFromParent: any;
  public releaseData: any[] = [];
  public childListData: any[] = [];
  public newReleaseData: any = null;
  public application: string;
  public releaseServicObj: ReleaseServices;
  public releaseEnvironmentObj: ReleaseEnvironment;
  public selectedServiceIndex: string;
  public selectedAppName: string;
  public spinnerService = false;
  public promoteStatus = false;
  public promoteData: any = {
    releaseName: '',
    source: '',
    services: [],
    env: []
  };
  showRelease = false;
  expandedIndex: number;
  ParentList: any[];
  ChildList: any[];
  // tslint:disable-next-line:ban-types
  releaseErrorMessage: String;
  newReleaseErrorMessage: string;

  constructor(private applicationService: ApplicationService, public notification: NotificationService) { }

  ngOnInit(): void {
    this.expandedIndex = -1;
    console.log(this.releaseDataFromParent);
    this.application = this.releaseDataFromParent.appName;
  //  this.selectedAppName = this.application;
    this.releaseData = this.releaseDataFromParent;
    // if (this.releaseDataFromParent.length === 0){
    //   this.releaseErrorMessage = 'No recent releases found.';
    // }
  }
  public newReleaseMethod(app) {
    this.spinnerService = true;
    this.showRelease = true;
    this.application = app;
    // if (this.releaseDataFromParent.appName === undefined){
    //   this.application = this.selectedAppName;
    // }
    this.applicationService.doNewRelease(this.application).subscribe(
      (response: any) => {
        response.services.forEach(item => {
        item.isChecked = false;
      });
        this.newReleaseData = response;
        if (response.services.length === 0) {
          this.newReleaseErrorMessage = 'No services found.';
        }
        this.spinnerService = false;
    },
    (error) => {
      console.log("erroeUI",error);
      
      //this.notification.showInfo("test","test");
      //alert('hello');
    }
    );
  }
  public cancelRelease(){
    this.showRelease = false;
  }
  public getChildDetails(data, index) {
    this.selectedServiceIndex = index;
  }
  public Collaps(index: number, childData: any) {
    this.expandedIndex = index === this.expandedIndex ? -1 : index;
    this.childListData = childData.env;
    this.ChildList = childData.services;
    }
    
  public promoteRelease() {
    this.promoteStatus = true;
    this.promoteData.services = [];
    this.promoteData.env = [];
    this.newReleaseData.services.forEach(item => {
         if (item.isChecked) {
        this.releaseServicObj = new ReleaseServices();
        this.releaseServicObj.serviceName = item.serviceName;
        this.releaseServicObj.tag = item.latestTag;
        this.releaseServicObj.image = item.image;
        this.promoteData.services.push(this.releaseServicObj);
      }
         this.promoteData.source = this.newReleaseData.source;
    });
    this.newReleaseData.env.forEach(item => {
      this.releaseEnvironmentObj = new ReleaseEnvironment();
      this.releaseEnvironmentObj.key = item.key;
      this.releaseEnvironmentObj.val = item.val;
      this.promoteData.env.push(this.releaseEnvironmentObj);
    });
    this.applicationService.promoteRelease(this.promoteData, this.application).subscribe((response: any) => {
      if (response.status === 'IN_PROGRESS'){
          this.notification.showSuccess('Success','Release process is IN_PROGRESS');
          this.showRelease = false;
          this.applicationService.getReleaseList(this.application).subscribe((relResponse: any) => {
          this.releaseDataFromParent = relResponse;
          this.releaseDataFromParent.appName = this.application;
          this.promoteData.releaseName = '';
          this.promoteData.jiraId = '';
          this.promoteStatus = false;
        //  this.application = this.releaseDataFromParent.appName;
        });
      } else {
        this.notification.showError('Error','Error in processing the Release');
        this.promoteStatus = false;
      }
    
    });
  }

}
