import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as OnboardingActions from '../store/onBoarding.actions';

@Component({
  selector: 'app-appliaction-list',
  templateUrl: './appliaction-list.component.html',
  styleUrls: ['./appliaction-list.component.less']
})
export class AppliactionListComponent implements OnInit {
  tableIsEmpty:boolean =  false;
  constructor(public store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
  }

  // Below function is use to redirect to create application page
  createApplication(){
    this.store.dispatch(OnboardingActions.loadApp());
  }
  
}
