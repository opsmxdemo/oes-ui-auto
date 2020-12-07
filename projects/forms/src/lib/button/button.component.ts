import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'opsmx-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class OpsMxButtonComponent implements OnInit {

  @Input() params: any = {};

  @Output() onClick = new EventEmitter();

  class = "";
  

  constructor() { }

  ngOnInit(): void {
    console.log(this.params);
    switch(this.params.color){
      case 'blue' : this.class = "btn-primary"; break;
      case 'red' : this.class = "btn-danger"; break;
      default : this.class = "btn-default"; break;
    } 
  }

  clickEvent(event:any) {
    this.onClick.emit(event);
  }

}


  