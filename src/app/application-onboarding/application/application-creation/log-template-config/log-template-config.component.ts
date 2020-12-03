import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogTemplateConfigService } from './log-template-config.service';

@Component({
  selector: 'app-log-template-config',
  templateUrl: './log-template-config.component.html',
  styleUrls: ['./log-template-config.component.less']
})
export class LogTemplateConfigComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<LogTemplateConfigComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public service: LogTemplateConfigService) {}

  ngOnInit() {

    this.service.init(this.data.applicationId, this.data.templateName).subscribe((resp: any) => {})

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
export interface DialogData {
  applicationId: any;
  templateName: any;
}