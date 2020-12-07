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
export class LogTemplateConfigComponent implements OnInit {
  
  loadLogTopicsComponent: boolean;
  loadChildComponents: boolean;
  formObj: FormGroup = new FormGroup({});

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<LogTemplateConfigComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public service: LogTemplateConfigService) {
    // super();
  }

  ngOnInit() {

    // this.formObj.addControl('logProvider', LogTemplateConfigService.logProviderForm); // Use log provider static form
    // this.formObj.addControl('logTopics', LogTemplateConfigService.LogTopicsForm);
    // this.formObj.addControl('logTags', LogTemplateConfigService.LogTopicsForm); // Use log tag static form

    this.service.init(this.data)
    .subscribe((resp: any) => {
      console.log('sfdas');
      this.loadChildComponents = true;
    });

  }

  close() {
    this.dialogRef.close({templateName: LogTemplateConfigService.templateName});
  }

  get logTopicsForm() {
    return LogTemplateConfigService.LogTopicsForm;
  }

  get logProviderForm() {
    return LogTemplateConfigService.logProviderForm;
  }

  formValid() {
    // Call the save template service function
    this.close();
  }

  formInvalid() {
    
  }

  submit() {
    this.service.submit().subscribe(resp => {
      this.close();
    });
  }

  submitJson() {
    this.service.submitJson().subscribe(resp => {
      this.close();
    });
  }

}
export interface DialogData {
  applicationId: any;
  templateName: any;
}