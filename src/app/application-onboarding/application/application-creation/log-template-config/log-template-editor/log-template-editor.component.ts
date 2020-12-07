import { Component, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { LogTemplateEditorService } from './log-template-editor.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { LogTemplateConfigService } from '../log-template-config.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-log-template-editor',
  templateUrl: './log-template-editor.component.html',

  styleUrls: ['./log-template-editor.component.less'],
  providers: [LogTemplateEditorService]
})
export class LogTemplateEditorComponent implements OnInit {

  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;

  public editorOptions: JsonEditorOptions;
  public data: any = null;
  logTemplateData: any;

  constructor(public service: LogTemplateEditorService) {}

  ngOnChanges(changes: SimpleChanges) {
    // this.data = LogTemplateConfigService.logTemplateData;
  }

  ngOnInit(): void {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];

    this.service.initEditService();

    this.service.$dataReceived.subscribe(flag => {
      if(flag) {
        this.data = this.service.templateData;
      } else {
        setTimeout(() => {
          this.service.initEditService();
        }, 100);
      }
    })
  }

  // Below function is use to fetched json from json editor
  showJson(event = null) {
    this.logTemplateData = this.editor.get();
    this.service.updateJson(this.logTemplateData);
  }

}
