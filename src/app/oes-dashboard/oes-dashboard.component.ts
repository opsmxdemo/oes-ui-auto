import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/Test.service';
import { NotificationService } from '../services/notification.service';
import { error } from 'protractor';

@Component({
  selector: 'app-oes-dashboard',
  templateUrl: './oes-dashboard.component.html',
  styleUrls: ['./oes-dashboard.component.less']
})
export class OesDashboardComponent implements OnInit {

  constructor(public testservice: TestService,
              public notification: NotificationService) { }

  ngOnInit(): void {
    this.testservice.getdummyapi().subscribe(
      (response) => {
        console.log('test',response);
        this.notification.showSuccess('Everything is alright','TESTAPI');
      },
      (error) => {
        console.log('testerror',error);
        this.notification.showError('Everything is not alright','TESTAPI'); 
      }
    )
  }

}
