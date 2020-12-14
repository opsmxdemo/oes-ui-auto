import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationSetupService } from './application-setup.service';

@Component({
  selector: 'app-application-setup',
  templateUrl: './application-setup.component.html',
  styleUrls: ['./application-setup.component.less']
})
export class ApplicationSetupComponent implements OnInit {
  
  constructor(public service: ApplicationSetupService, private activatedRoute: ActivatedRoute) { } 

  ngOnInit(): void {
    if(this.activatedRoute.snapshot.params.id) {
      ApplicationSetupService.id = this.activatedRoute.snapshot.params.id;
    }
    this.service.init();

  }

}
