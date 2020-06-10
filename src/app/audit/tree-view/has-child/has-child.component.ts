import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-has-child',
  templateUrl: './has-child.component.html',
  styleUrls: ['./has-child.component.less']
})
export class HasChildComponent implements OnInit {

  @Input() childData: any;
  @Input() displayedColumns: string[];
 
  constructor() { }

  ngOnInit(): void {
    
  }

}
