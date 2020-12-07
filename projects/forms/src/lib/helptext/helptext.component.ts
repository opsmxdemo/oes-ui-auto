import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'opsmx-helptext',
  templateUrl: './helptext.component.html',
  styleUrls: ['./helptext.component.css']
})
export class OpsMxHelptextComponent implements OnInit {

  @Input() params: any = {};

  //@Output() onChange = new EventEmitter();

  //id: any = '';

  constructor() { }

  ngOnInit(): void {
  }

}
