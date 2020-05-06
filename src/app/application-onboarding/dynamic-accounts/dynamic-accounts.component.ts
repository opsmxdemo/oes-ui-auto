import { Component, OnInit } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import * as OnboardingActions from '../store/onBoarding.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-dynamic-accounts',
  templateUrl: './dynamic-accounts.component.html',
  styleUrls: ['./dynamic-accounts.component.less']
})
export class DynamicAccountsComponent implements OnInit {
  accountListData:any;
  constructor(public store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(OnboardingActions.loadAccountList());

     // fetching data from state
     this.store.select('appOnboarding').subscribe(
      (response) => {
       this.accountListData = response.accountList;
       console.log("account",this.accountListData);
      }
    );
  }

}
