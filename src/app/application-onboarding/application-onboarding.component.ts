import { Component, OnInit } from '@angular/core';
import * as DataSourceActions from './data-source/store/data-source.actions';
import * as fromFeature from './store/feature.reducer';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';


@Component({
  selector: 'app-application-onboarding',
  templateUrl: './application-onboarding.component.html',
  styleUrls: ['./application-onboarding.component.less']
})
export class ApplicationOnboardingComponent implements OnInit {

  userType = 'OES-AP';                                            // It contain type of user i.e, AP, OES or both.


  constructor(public store: Store<fromFeature.State>,
              public appStore: Store<fromApp.AppState>) { }

  ngOnInit(){
    // dispatching action relatted to datasource list
    this.store.dispatch(DataSourceActions.loadDatasourceList());

    // Below function is use to fetch data from AppState to update usertype
    this.appStore.select('layout').subscribe(
      (layoutRes) => {
        if(layoutRes.installationMode !== ''){
          this.userType = layoutRes.installationMode;
        }
      }
    )
  }

}
