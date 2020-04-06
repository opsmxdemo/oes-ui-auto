import { Component, OnInit, Input } from '@angular/core';
import {ReleaseService} from '../services/release.service';
import { isBoolean } from 'util';

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.less']
})
export class ReleaseComponent implements OnInit {
  public releaseData: any[] = [];
  showRelease = false;
 // @Input() receivedParentMessage: string;
  constructor(private releaseService: ReleaseService) { }

  ngOnInit(): void {
    this.releaseService.getReleaseList().subscribe((response: any) => {
      console.log(response);
      this.releaseData = response;
    });
  }
  public newReleaseMethod() {
    this.showRelease = true;
  }
  public cancelRelease(){
    this.showRelease = false;
  }

}
