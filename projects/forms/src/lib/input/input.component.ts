import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmitUserEvents } from '../user-events';

@Component({
  selector: 'opsmx-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class OpsMxInputComponent extends EmitUserEvents implements OnInit {

  @Input() params: any = {};

  @Output() onChange = new EventEmitter();
  @Output() onClick = new EventEmitter();
  @Output() onBlur = new EventEmitter();
  @Output() onFocus = new EventEmitter();
  @Output() onKeyUp = new EventEmitter();
  @Output() onKeyPress = new EventEmitter();
  @Output() onKeyDown = new EventEmitter();
  id: any = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log(this.params);
    if(!this.params.errorMessages) {
      this.params.errorMessages = [];
    }
  }

  isInValid() {
    if(!this.params.errorMessages || this.params.errorMessages.length == 0) {
      this.params.errorMessages = this.params.label ? [`${this.params.label} is invalid`] : ['Invalid value'];
    }
    return this.params.formControl.touched && this.params.formControl.invalid;
  }

}
