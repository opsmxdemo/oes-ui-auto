import { Component, OnInit } from '@angular/core';
import * as DataSourceActions from './data-source/store/data-source.actions';
import * as fromFeature from './store/feature.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-application-onboarding',
  templateUrl: './application-onboarding.component.html',
  styleUrls: ['./application-onboarding.component.less']
})
export class ApplicationOnboardingComponent implements OnInit {

  constructor(public store: Store<fromFeature.State>) { }

  ngOnInit(){
    // dispatching action relatted to datasource list
    this.store.dispatch(DataSourceActions.loadDatasourceList());
  }

}
