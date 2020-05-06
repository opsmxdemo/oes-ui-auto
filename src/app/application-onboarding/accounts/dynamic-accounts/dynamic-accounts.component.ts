import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as OnboardingActions from '../../store/onBoarding.actions';

@Component({
  selector: 'app-dynamic-accounts',
  templateUrl: './dynamic-accounts.component.html',
  styleUrls: ['./dynamic-accounts.component.less']
})
export class DynamicAccountsComponent implements OnInit {
  accountListData: any;

  constructor( public store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

     // fetching data from state
     this.store.select('appOnboarding').subscribe(
      (response) => {
       console.log(response);
       this.accountListData = response.accountList;
       console.log(JSON.stringify(this.accountListData));
      }
    );
     this.store.dispatch(OnboardingActions.loadAccountList());

  }

}
