/*
 * @author Satya Kiran Rayasam
 * Every component serving the Angular form should extend this Abstract Class to avoid custom coding for validating all fields on submit
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()

export abstract class OpsMxForms {

  abstract formObj: FormGroup;

  abstract formValid();

  abstract formInvalid();

  submit() {
    this.formObj.markAllAsTouched();
    if(this.formObj.valid) {
      this.formValid();
    } else {
      this.formInvalid();
    }
  }

}
