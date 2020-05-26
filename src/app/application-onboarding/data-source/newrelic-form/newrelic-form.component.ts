import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators} from '@angular/forms'

@Component({
  selector: 'app-newrelic-form',
  templateUrl: './newrelic-form.component.html',
  styleUrls: ['./newrelic-form.component.less']
})
export class NewrelicFormComponent implements OnInit {
  newrelicForm: FormGroup;
  submitted: false;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // this.newrelicForm = this.formBuilder.group({
    //   accountName: ['', Validators.required],
    //   sourceType: 'Newrelic',
    //   credentialType: 'monitoring',
    //   applicationName: ['', [Validators.required]],
    //   applicationKey: ['', [Validators.required]]
    //   // accountName: data.newrelicaccountName,
    //   // sourceType: "Newrelic",
    //   // credentialType: "monitoring",
    //   // applicationName: data.apiKey,
      // applicationKey: data.applicationKey
  //});
  }
  // convenience getter for easy access to form fields
  // get nf() { return this.newrelicForm.controls; }

  // onReset(){

  }

//}
