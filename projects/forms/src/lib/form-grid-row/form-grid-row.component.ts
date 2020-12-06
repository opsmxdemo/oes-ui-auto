import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormGrid, FormGridRow } from '../form-grid/form-grid.interface';
import { EmitUserEvents } from '../user-events';

@Component({
  selector: 'opsmx-form-grid-row',
  templateUrl: './form-grid-row.component.html',
  styleUrls: ['./form-grid-row.component.css']
})
export class OpsMxFormGridRowComponent extends EmitUserEvents implements OnInit {

  @Input() rowFieldTypes: any;
  @Input() gridTemplateColumns: string;
  @Input() index: number;
  @Input() formGroupObj: FormGroup;
  @Input() rowDeleteFlag: boolean;

  @Output() deleteRow = new EventEmitter();

  params: any = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    let fields = Object.keys(this.formGroupObj.controls);
    this.rowFieldTypes.forEach((field, i) => {
      field.id += '_formGridRowField' + i;
      field.formControl = this.formGroupObj.get(fields[i]);
      field.rowIndex = this.index;
    });
  }

  rowDelete() {
    // this.formGroup.removeAt(this.index);
    this.deleteRow.emit({formGroup: this.formGroupObj, index: this.index});
  }

}
