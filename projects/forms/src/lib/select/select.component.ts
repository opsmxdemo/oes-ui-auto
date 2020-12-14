import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'opsmx-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class OpsMxSelectComponent implements OnInit {

  @Input() params: any = {};

  @Output() changed = new EventEmitter();

  id: any = '';

  constructor() { }

  ngOnInit(): void {
    // console.log(this.params);
  }

  changeEvent(event:any) {
    this.changed.emit(event);
  }

}
