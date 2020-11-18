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

  userType = '';                                            // It contain type of user i.e, AP, OES or both.


  constructor(public store: Store<fromFeature.State>,
              public appStore: Store<fromApp.AppState>) { }

  ngOnInit(){

    // Below function is use to fetch data from AppState to update usertype
    // this.appStore.select('layout').subscribe(
    //   (layoutRes) => {
    //     if(layoutRes.installationMode !== ''){
    //       this.userType = layoutRes.installationMode;
    //       if(this.userType !== ''){
    //         // dispatching action relatted to datasource list
    //         switch(this.userType){
    //           case 'AP':
    //             this.store.dispatch(DataSourceActions.loadAPDatasourceList());
    //             break;
    //           case 'OES':
    //             this.store.dispatch(DataSourceActions.loadOESDatasourceList());
    //             break;
    //           case 'OES-AP':
    //             this.store.dispatch(DataSourceActions.loadDatasourceList());
    //             break;
    //         }
    //       }
    //     }
    //   }
    // )
  }

}
