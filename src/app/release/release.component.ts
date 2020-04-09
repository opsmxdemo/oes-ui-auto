import { Component, OnInit, Input } from '@angular/core';
import {ApplicationService} from '../services/application.service';

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.less']
})
export class ReleaseComponent implements OnInit {
  public releaseData: any[] = [];
  public newReleaseData: any = null;
  public application: string;
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
      console.log(response);
      this.newReleaseData = response;
    });
  }
  public cancelRelease(){
    this.showRelease = false;
  }

}
