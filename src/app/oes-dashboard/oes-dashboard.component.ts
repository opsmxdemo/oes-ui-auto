import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-oes-dashboard',
  templateUrl: './oes-dashboard.component.html',
  styleUrls: ['./oes-dashboard.component.less']
})
export class OesDashboardComponent implements OnInit {

  constructor(public notification: NotificationService) { }

  ngOnInit(){}
}
