import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ApplicationDetailsService } from './application-details.service';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.less'],
  providers :[ApplicationDetailsService]
})
export class ApplicationDetailsComponent implements OnInit {
  applicationNameParams: any;
  applicationDescriptionParams: any;
  applicationEmailParams: any;
  imageSourceParams: any;
  applicationDetailsUpdateParams: any;

  constructor(public appDetailService: ApplicationDetailsService) { }

  ngOnInit(): void {
    this.applicationNameParams = {
      label: "Application Name",
      type: 'text',
      formControl: new FormControl(),
      hidden: false,
      id: 'input-applicationName',
      required: true,
      placeholder: "Application Name",
      margin : "10px 0px"
    };   

    this.applicationDescriptionParams = {
      label: "Application Description",
      type: 'text',
      formControl: new FormControl(),
      hidden: false,
      id: 'input-applicationDescription',
      required: true,
      placeholder: "Application Description",
      margin : "10px 0px"
    };   

    this.applicationEmailParams = {
      label: "Email ID",
      type: 'text',
      formControl: new FormControl(),
      hidden: false,
      id: 'input-emailId',
      required: true,
      placeholder: "Email Id",
      margin : "10px 0px"
    };   

    this.imageSourceParams = {
      label: 'Image Source',
      disabled: false,
      formControl: new FormControl(),
      hidden: false,
      id: 'select-imageSource',
      required : false,
      options : [
        { value : "value1",name : "name1"},
      ],
      addOption : false,
      addOptionLabel : "",
      margin : "10px 0px"
    };


  this.applicationDetailsUpdateParams = {
    text: "Save & Next",
    type: 'button',
    hidden: false,
    id: 'applicationDetailsUpdateParams-tagName',
    color: 'blue'
  };


  }

}
