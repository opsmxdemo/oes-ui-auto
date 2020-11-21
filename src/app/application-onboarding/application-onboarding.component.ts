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

  featureList: any;                                           // It contain type of user i.e, Autopilot Sapor and Visibility.
  


  constructor(public store: Store<fromFeature.State>,
              public appStore: Store<fromApp.AppState>) { }

  ngOnInit(){

    // Below function is use to fetch data from AppState to update usertype
    this.appStore.select('layout').subscribe(
      (layoutRes) => {
        if(layoutRes.supportedFeatures !== null){
          this.featureList = layoutRes.supportedFeatures;
          if(this.featureList != ''){
            // dispatching action relatted to datasource list
            if (this.featureList && this.featureList.includes('deployment_verification')) {
              this.store.dispatch(DataSourceActions.loadAPDatasourceList());
            }

            if (this.featureList && this.featureList.includes('sapor')) {
              this.store.dispatch(DataSourceActions.loadOESDatasourceList());

            }

            if (this.featureList && this.featureList.includes('visibility')) {
              this.store.dispatch(DataSourceActions.loadDatasourceList());

            }
           
          }
        }
      }
    )
  }

}
