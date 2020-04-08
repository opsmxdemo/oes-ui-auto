import { Component, OnInit, Input } from '@angular/core';
import {ApplicationService} from '../services/application.service';

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.less']
})
export class ReleaseComponent implements OnInit {
  public releaseData: any[] = [];
  public newReleaseData: any[] = [];
  public application: string;
  showRelease = false;

  @Input() childMessage: string;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationService.getReleaseList().subscribe((response: any) => {
      console.log(response);
      this.releaseData = response;
    });
    this.application = this.applicationService.childApplication;
  }
  public newReleaseMethod() {
    this.showRelease = true;
    this.applicationService.doRelease().subscribe((response: any) => {
      console.log(response);
      this.newReleaseData = response;
    });
  }
  public cancelRelease(){
    this.showRelease = false;
  }

}
