import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-policy-management',
  templateUrl: './policy-management.component.html',
  styleUrls: ['./policy-management.component.less']
})
export class PolicyManagementComponent implements OnInit {

  endpointForm: FormGroup;                               // For Endpoint Section
  policyForm: FormGroup;                                 // For Policy section

  constructor() { }

  ngOnInit(){

    // defining reactive form approach for endpointForm
    this.endpointForm = new FormGroup({
      endpointType: new FormControl('',Validators.required),
      endpointUrl: new FormControl('',Validators.required)
    });

     // defining reactive form approach for policyForm
     this.policyForm = new FormGroup({
      name: new FormControl('',Validators.required),
      description: new FormControl('',Validators.required),
      policyDetails: new FormControl('')
    });

  }

}
