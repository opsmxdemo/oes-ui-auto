import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/Test.service';

@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.less']
})
export class ApplicationDashboardComponent implements OnInit {

  constructor(public test:TestService) { }

  ngOnInit(): void {
    console.log('service',this.test.rp)
  }

}
