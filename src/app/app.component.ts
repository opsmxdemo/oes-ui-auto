import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';
import * as LayoutAction from './layout/store/layout.actions';
import * as AuditActions from './audit/store/audit.actions';
import * as OnboardingActions from './application-onboarding/store/onBoarding.actions';
import { Menu } from './models/layoutModel/sidenavModel/menu.model';
import { environment } from '../environments/environment'
import * as $ from 'jquery';
import 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'OES-UI';
  addclass = false;
  isAuthenticate = false;
  Sidebar: Menu;
  applicationCount: number;

  constructor(public store: Store<fromApp.AppState>) { }
  // For tooltip
  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
    $('[data-toggle="dropdown"]').dropdown();
  }
  ngOnInit() {

    //Dispatching action to fetch Sidebar Menu
    this.store.dispatch(new LayoutAction.LoadPage());

    //Dispatching action for autoLogin functionality
    this.store.dispatch(new AuthAction.LoginStart());

    //fetching data from AuthState
    this.store.select('auth').subscribe(
      (response) => {
        this.isAuthenticate = response.authenticated;
        if (response.authResponse === null) {
          var browserUrl = window.location.href;
          var arr = browserUrl.split("/");
          var resultUrl = arr[0] + "//" + arr[2] + "/appdashboard";
          var encodedUrl = encodeURIComponent(resultUrl);
          this.loginRedirect(encodedUrl)
        }else{
          //Dispatching action to fetch application data from API
          this.store.dispatch(OnboardingActions.loadAppList());

          //Dispatching action to fetch audit initial data
          this.store.dispatch(AuditActions.loadAudit());
        }
      }
    );

    // fetching data from LayoutState
    this.store.select('layout').subscribe(
      (response) => {
        this.Sidebar = response.menu;
        this.applicationCount = response.appliactionData;
      }
    );
  }

  loginRedirect(callback): void {
    window.location.href = `${environment.endPointUrl}auth/redirectauto?to=${callback}`;
  }

  toggleNavbar() {
    this.addclass = !this.addclass;
  }

}
