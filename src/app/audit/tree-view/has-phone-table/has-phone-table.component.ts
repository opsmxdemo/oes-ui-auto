import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-has-phone-table',
  templateUrl: './has-phone-table.component.html',
  styleUrls: ['./has-phone-table.component.less']
})
export class HasPhoneTableComponent implements OnInit {

  @Input() phones: any;

  displayedColumns: string[] = [
    'Phone ID',
    'ID of the relative',
    'Phone'
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
