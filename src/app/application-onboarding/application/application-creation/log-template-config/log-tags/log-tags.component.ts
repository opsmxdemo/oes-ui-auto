import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { OpsMxForms } from 'projects/forms/src';
import { LogTemplateConfigService } from '../log-template-config.service';
import { LogTagService } from './log-tag.service';

@Component({
  selector: 'app-log-tags',
  templateUrl: './log-tags.component.html',
  styleUrls: ['./log-tags.component.less']
})
export class LogTagsComponent implements OnInit {

  tagFormFlag = false;
  color: ThemePalette = 'primary';
  clusterTagEnabled = false;
  checked = false;
  disabled = false;

  constructor(public service: LogTagService) {
  }

  ngOnInit(): void {
    this.service.initTags().subscribe((resp: any) => {
      this.tagFormFlag = true;
    });
  }

  get logTagForms() {
    return LogTemplateConfigService.LogTagsForm;
  }

  onChange(event: any) {

  }

  enableClusterTag() {
    console.log(event);
    console.log(this.clusterTagEnabled)
  }

}
