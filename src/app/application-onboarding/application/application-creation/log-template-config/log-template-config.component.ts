import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpsMxForms } from 'projects/forms/src';
import { LogTemplateConfigService } from './log-template-config.service';
import { LogTopicsService } from './log-topics/log-topics.service';

@Component({
  selector: 'app-log-template-config',
  templateUrl: './log-template-config.component.html',
  styleUrls: ['./log-template-config.component.less']
})
export class LogTemplateConfigComponent extends OpsMxForms implements OnInit {

  firstFormGroup: FormGroup;
  loadLogTopicsComponent: boolean;
  formObj: FormGroup;

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<LogTemplateConfigComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public service: LogTemplateConfigService) {
    super();
  }

  ngOnInit() {

    this.formObj.addControl('logProvider', LogTemplateConfigService.LogTopicsForm); // Use log provider static form
    this.formObj.addControl('logTopics', LogTemplateConfigService.LogTopicsForm);
    this.formObj.addControl('logTags', LogTemplateConfigService.LogTopicsForm); // Use log tag static form

    this.service.init(this.data.applicationId, this.data.templateName)
    .subscribe((resp: any) => {
      console.log('sfdas');
      this.loadLogTopicsComponent = true;
    });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

  get logTopicsForm() {
    return LogTemplateConfigService.LogTopicsForm;
  }

  formValid() {
    // Call the save template service function
    this.close();
  }

  formInvalid() {
    
  }

}
export interface DialogData {
  applicationId: any;
  templateName: any;
}