import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { CreateAccount } from 'src/app/models/applicationOnboarding/createAccountModel/createAccount.model';
import * as OnboardingActions from '../store/onBoarding.actions';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.less']
})
export class CreateAccountComponent implements OnInit {
  appData: CreateAccount = null; 
  createAccountForm: FormGroup;                               // Form for Account details                                                                      

  constructor(public store: Store<fromApp.AppState>,
              public router: Router) { }

  ngOnInit(): void {
    
  }

}
