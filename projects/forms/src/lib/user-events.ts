import { EventEmitter, Output } from '@angular/core';

export class EmitUserEvents {

    @Output() changed = new EventEmitter();
    @Output() onClick = new EventEmitter();
    @Output() onBlur = new EventEmitter();
    @Output() onFocus = new EventEmitter();
    @Output() onKeyUp = new EventEmitter();
    @Output() onKeyPress = new EventEmitter();
    @Output() onKeyDown = new EventEmitter();

    fieldOptions: any = '';

    changeEvent(event: any) {
        let data = this.fieldOptions ? {event: event, fieldOptions: this.fieldOptions} : event;
        this.changed.emit(data);
    }

    clickEvent(event: any) {
        let data = this.fieldOptions ? {event: event, fieldOptions: this.fieldOptions} : event;
        this.onClick.emit(data);
    }

    blurEvent(event: any) {
        let data = this.fieldOptions ? {event: event, fieldOptions: this.fieldOptions} : event;
        this.onBlur.emit(data);
    }

    focusEvent(event: any) {
        let data = this.fieldOptions ? {event: event, fieldOptions: this.fieldOptions} : event;
        this.onFocus.emit(data);
    }

    keyUpEvent(event: any) {
        let data = this.fieldOptions ? {event: event, fieldOptions: this.fieldOptions} : event;
        this.onKeyUp.emit(data);
    }

    keyPressEvent(event: any) {
        let data = this.fieldOptions ? {event: event, fieldOptions: this.fieldOptions} : event;
        this.onKeyPress.emit(data);
    }

    keyDownEvent(event: any) {
        let data = this.fieldOptions ? {event: event, fieldOptions: this.fieldOptions} : event;
        this.onKeyDown.emit(data);
    }
}