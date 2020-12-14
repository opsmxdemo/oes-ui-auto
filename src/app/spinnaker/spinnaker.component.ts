import { Component, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-spinnaker',
  templateUrl: './spinnaker.component.html',
  styleUrls: ['./spinnaker.component.less']
})
export class SpinnakerComponent implements OnInit {

  url: any;

  constructor(private activatedRoute: ActivatedRoute, public sanitize: DomSanitizer) { }

  ngOnInit(): void {
    if(this.activatedRoute.snapshot.params.url) {
      this.url = this.sanitize.bypassSecurityTrustResourceUrl(this.activatedRoute.snapshot.params.url)
    } else {
      this.url = this.sanitize.bypassSecurityTrustResourceUrl('https://staging.opsmx.com');
    }
  }

}
