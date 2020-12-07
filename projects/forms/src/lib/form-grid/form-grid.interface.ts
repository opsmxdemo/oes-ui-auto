import { FormControl } from '@angular/forms';

export interface FormGrid {
    formGridHeader: FormGridHeader[];
    addRow: boolean;
    deleteRow: boolean;
}

export interface FormGridHeader {
    headerName: string;
    fieldOptions: FormGridFieldType;
    width: number;
    tooltip: string;
}

export interface FormGridFieldType {
    field: string;
    type: string;
    fieldProperties: any;
}

export interface FormGridRow {
    formField: FormGridRowField[];
}

export interface FormGridRowField {
    formControl: FormControl;
    fieldOptions: any;
}