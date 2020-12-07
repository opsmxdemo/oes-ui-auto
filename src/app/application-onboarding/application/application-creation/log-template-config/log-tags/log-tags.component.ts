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
export class LogTagsComponent extends OpsMxForms implements OnInit {

  tagFormFlag = false;
  color: ThemePalette = 'accent';
  clusterTagEnabled = false;
  checked = false;
  disabled = false;
  addEditClusterTagInput: boolean;
  formObj: FormGroup;
  currentTag: any = {};

  constructor(public service: LogTagService) {
    super();
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

  onChangeCusterTag(event: any) {
    this.currentTag = this.service.tagList.find(tag => tag.name == event.target.value);
    console.log(this.currentTag);
  }

  enableClusterTag(event: any) {
    console.log(event);
    // console.log(this.clusterTagEnabled)
    // this.service.reloadFormGrid = this.service.clusterTagEnabled;
    if(this.service.clusterTagEnabled && this.service.clusterTagsListOptions.length > 0) {
      this.service.reloadFormGrid = this.service.clusterTagEnabled;
    } else {
      this.service.getTags().subscribe();
    }
  }

  addNewTag() {
    this.formObj = this.service.tagForm;
    this.formObj.reset();
    this.addEditClusterTagInput = true;
  }

  editNewTag() {
    this.formObj = this.service.tagForm;
    this.formObj.setValue({
      id: this.currentTag.id,
      name: this.currentTag.name
    });
    this.addEditClusterTagInput = true;
  }

  removeTags() {
    this.formObj = this.service.tagForm;
    this.formObj.setValue({
      id: this.currentTag.id,
      name: this.currentTag.name
    });
    this.service.deleteClusterTag().subscribe((resp: any) => {
      this.service.tagForm.reset();
      this.service.getTags().subscribe();
    });
  }

  saveTagClick() {
    this.service.saveClusterTagName().subscribe((resp: any) => {
      this.service.tagForm.reset();
      this.addEditClusterTagInput = false;
      this.service.getTags().subscribe();
    });
  }

  updateTagClick() {
    this.service.updateClusterTagName().subscribe((resp: any) => {
      this.service.tagForm.reset();
      this.addEditClusterTagInput = false;
      this.service.getTags().subscribe(resp => {
        this.service.updateFormArrayVal(this.currentTag);
      });
    });
  }

  canceSaveTagClick() {
    this.service.tagForm.reset();
    this.addEditClusterTagInput = false;
  }

  get loadTagsFormGridForm() {
    return LogTemplateConfigService.LogTagsForm.get('tags');
  }

  onChangeOption(event) {

  }

  addRowGrid(event) {
    this.service.addFormRow();
  }

  deleteRow(event) {

  }

  formValid() {
    if(this.formObj.get('id').value) {
      this.updateTagClick();
    } else {
      this.saveTagClick();
    }
  }

  formInvalid() {

  }

}
