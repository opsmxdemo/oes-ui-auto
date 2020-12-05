import { Component, OnInit ,ViewChild, OnChanges, SimpleChanges} from '@angular/core';
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
  providers : [LogTemplateEditorService]
})
export class LogTemplateEditorComponent extends LogTemplateConfigService implements OnInit {

  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;

  public editorOptions: JsonEditorOptions;
  public data: any = null;
  logTemplateData : any;

  

  constructor(public http: HttpClient, public router: Router, public toastr: NotificationService, public environment: AppConfigService) {
    super(http,router,toastr,environment);
  }

  ngOnChanges(changes: SimpleChanges){
    this.data=LogTemplateConfigService.logTemplateData;
  }

  ngOnInit(): void {    
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
  }

  // Below function is use to fetched json from json editor
  showJson(event = null){
    this.logTemplateData = this.editor.get();
  }

}
