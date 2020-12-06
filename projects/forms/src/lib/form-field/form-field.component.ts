import { Component, Input, OnInit } from '@angular/core';
import { EmitUserEvents } from '../user-events';

@Component({
  selector: 'opsmx-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.css']
})
export class OpsMxFormFieldComponent extends EmitUserEvents implements OnInit {

  @Input() params: any = {};
  @Input() index: number;

  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log(this.params);
    
  }

}
