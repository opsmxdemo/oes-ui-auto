import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less']
})
export class ApplicationComponent implements OnInit {

  createApplicationForm: FormGroup;      // For Application Section
  groupPermissionForm: FormGroup;           // For Permission Section

  constructor(public sharedService: SharedService) { }

  ngOnInit() {

    // defining reactive form approach for createApplicationForm
    this.createApplicationForm = new FormGroup({
      name: new FormControl('', Validators.required, this.valitateApplicationName.bind(this)),
      desc: new FormControl(''),
    });

    // defining reactive form for permission Section
    this.groupPermissionForm = new FormGroup({
      userGroups:new FormArray([
        new FormGroup({
          userGroup: new FormControl('Test',Validators.required),
          permission: new FormControl('', Validators.required),
        })
      ])
    });
    
  }

  //Below function is custom valiadator which is use to validate application name through API call, if name is not exist then it allows us to proceed.
  valitateApplicationName(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {

      this.sharedService.validateApplicationName(control.value, 'application').subscribe(
        (response) => {
          if (response['nameExist'] === true) {
            resolve({ 'nameMatches': true });
          } else {
            resolve(null);
          }
        }
      )
    });
    return promise;
  }

  //Below function is use to add more permission group
  addGroup(){
    (<FormArray>this.groupPermissionForm.get('userGroups')).push(
      new FormGroup({
        userGroup: new FormControl('', [Validators.required]),
        permission: new FormControl('', Validators.required),
      })
    );
  }

  // Below function is use to remove exist permission group
  removeGroup(index){
    (<FormArray>this.groupPermissionForm.get('userGroups')).removeAt(index);
  }

}
