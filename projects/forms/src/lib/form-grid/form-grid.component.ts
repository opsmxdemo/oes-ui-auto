import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray } from '@angular/forms';
import { EmitUserEvents } from '../user-events';
import { FormGrid, FormGridHeader, FormGridRow } from './form-grid.interface';

@Component({
  selector: 'opsmx-form-grid',
  templateUrl: './form-grid.component.html',
  styleUrls: ['./form-grid.component.css']
})
export class OpsMxFormGridComponent extends EmitUserEvents implements OnInit, OnChanges {

  @Input() header: FormGrid;
  @Input() formArrayObj: FormArray;
  @Input() height: string;

  @Output() addRow = new EventEmitter();
  @Output() deleteRow = new EventEmitter();

  gridTemplateColumns: string;
  rowFieldTypes: any[];
  fieldList: any = [];

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (this.rowFieldTypes) {
    //   console.log(changes);
    //   let fieldType = JSON.parse(JSON.stringify(this.fieldList));
    //   fieldType.forEach((field: any) => {
    //     field.id += this.rowFieldTypes.length;
    //   });
    //   this.rowFieldTypes.splice(0, 0, fieldType);
    // }
  }

  ngOnInit(): void {

    let widths = [];
    this.rowFieldTypes = [];
    let rowFieldTypes = [];

    this.header.formGridHeader.forEach((head, i) => {
      widths.push(head.width + '%');
      this.fieldList.push(head.fieldOptions)
    });

    this.formArrayObj.controls.forEach((control, i) => {
      let fieldType = JSON.parse(JSON.stringify(this.fieldList));
      fieldType.forEach((field: any) => {
        field.id += i;
      });
      this.rowFieldTypes.push(Object.assign([], fieldType));
    });

    widths.push('5%');
    this.gridTemplateColumns = `repeat(auto-fit, ${widths.join(' ')})`;
  }

  addNewRow() {
    let fieldType = JSON.parse(JSON.stringify(this.fieldList));
    fieldType.forEach((field: any) => {
      field.id += this.rowFieldTypes.length;
    });
    this.rowFieldTypes.splice(0, 0, fieldType);
    this.addRow.emit();
  }

  rowDelete(event, index) {
    this.formArrayObj.removeAt(index);
    this.rowFieldTypes.splice(index, 1);
    this.deleteRow.emit({ row: event.formGroup, index: index });
  }

  getWidth() {
    if(this.formArrayObj.controls.length > 0) {
      return document.getElementById('formGridRow0') ? document.getElementById('formGridRow0').offsetWidth + 'px' : 'auto';
    }
  }

}
