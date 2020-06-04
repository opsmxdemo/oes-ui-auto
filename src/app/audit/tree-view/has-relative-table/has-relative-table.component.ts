import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-has-relative-table',
  templateUrl: './has-relative-table.component.html',
  styleUrls: ['./has-relative-table.component.less']
})
export class HasRelativeTableComponent implements OnInit {

  @Input() relatives: any;

  displayedColumns: string[] = [
    'expandIcon', 
    'Relative ID', 
    'Patient ID', 
    'Is alive?', 
    'Frequency of visits'
  ];
  constructor() { }

  ngOnInit(): void {
  }
  

}
