import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { OpsMxForms } from 'projects/forms/src/public-api';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-log-provider',
  templateUrl: './log-provider.component.html',
  styleUrls: ['./log-provider.component.less']
})
export class LogProviderComponent extends OpsMxForms implements OnInit {

  @Input() logTemplate : any;

  params1 : any;
  logProviderParams : any;
  logAccountParams : any;
  formGroup : FormGroup;
  formControl : FormControl;
  autoBaseHelpParams : any;
  templateNameParams : any;
  namespaceParams : any;
  indexPatternParams : any;
  kibanaIndexParams : any;
  regularExpressionParams : any;
  responseKeyParams : any;
  senstivityParams : any;
  formObj = new FormGroup({
    formControl: new FormControl('')
  })
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  
  constructor() { 
    super()
  }

  ngOnInit(): void {
    console.log("Log Provider");
    console.log(this.logTemplate);

    //this.formObj 

    this.formGroup = new FormGroup({
      provider: new FormControl('value1'),
      logaccount : new FormControl('')
    });

    
    
    this.params1 = {
      type: 'button',
      text: 'Next',
      color: 'blue',
      disabled : false      
    };

    this.logProviderParams = {
      label: 'Provider',
      disabled: false,
      formControl: this.formGroup.get('provider'),
      hidden: false,
      id: 'select-logProvider',
      required : true,
      options : [
        { value : "value1",name : "name1"},
        { value : "value2",name : "name2"},
        { value : "value3",name : "name3"},
        { value : "value4",name : "name4"},
      ],
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };

    this.logAccountParams = {
      label: 'Log Account',
      disabled: false,
      formControl: this.formGroup.get('logaccount'),
      hidden: false,
      id: 'select-logAccount',
      required : false,
      options : [
        { value : "value1",name : "name1"},
        { value : "value2",name : "name2"},
        { value : "value3",name : "name3"},
        { value : "value4",name : "name4"},
      ],
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };

    this.formGroup.get('provider').setValue("value1"); 


    this.autoBaseHelpParams = {
      title : "ML based learning of the baseline from historic analysis"
    };

    this.templateNameParams = {
      label: "Log Template Name",
      type: 'text',
      formControl: this.formObj.get('formControl'),
      hidden: false,
      id: 'input-templateName',
      required: true,
      placeholder: "Log Template Name",
      margin : "10px 0px"
    };

    this.namespaceParams = {
      label: "Namespace",
      type: 'text',
      formControl: this.formObj.get('formControl'),
      hidden: false,
      id: 'input-namespace',
      required: false,
      placeholder: "Namespace",
      margin : "10px 0px"
    };

    this.indexPatternParams = {
      label: "Index Pattern",
      type: 'text',
      formControl: this.formObj.get('formControl'),
      hidden: false,
      id: 'input-indexpattern',
      required: false,
      placeholder: "Index pattern",
      margin : "10px 0px"
    };

    this.kibanaIndexParams = {
      label: "Kibana Default Index",
      type: 'text',
      formControl: this.formObj.get('formControl'),
      hidden: false,
      id: 'input-kibanaindex',
      required: false,
      placeholder: "Kibana default index",
      margin : "10px 0px"
    };

    this.regularExpressionParams = {
      label: "Regular Expression",
      type: 'text',
      formControl: this.formObj.get('formControl'),
      hidden: false,
      id: 'input-regularExpression',
      required: false,
      placeholder: "Regular Expression",
      margin : "10px 0px"
    };

    this.responseKeyParams = {
      label: 'Response Key',
      disabled: false,
      formControl: this.formGroup.get('responsekey'),
      hidden: false,
      id: 'select-responsekey',
      required : false,
      options : [
        { value : "value1",name : "name1"},
        { value : "value2",name : "name2"},
        { value : "value3",name : "name3"},
        { value : "value4",name : "name4"},
      ],
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };

    this.senstivityParams = {
      label: 'Level of Sensitivity',
      disabled: false,
      formControl: this.formGroup.get('sensitivity'),
      hidden: false,
      id: 'select-sensitivity',
      required : false,
      options : [
        { value : "value1",name : "name1"},
        { value : "value2",name : "name2"},
        { value : "value3",name : "name3"},
        { value : "value4",name : "name4"},
      ],
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };
  }

  onChange(event) {
    console.log(event);
  }

  formValid(){

  }

  formInvalid(){
    
  }


}
