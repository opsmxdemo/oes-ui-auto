import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';
import * as LayoutAction from './layout/store/layout.actions';
import { Menu } from './models/layoutModel/sidenavModel/menu.model';
import { environment } from '../environments/environment.prod'
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

    //Dispatching action for pipelineData functionality
    //this.store.dispatch(AppOnboardingAction.loadApp());

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
    window.location.href = `${environment.samlUrl}auth/redirectauto?to=${callback}`;
  }

  toggleNavbar() {
    this.addclass = !this.addclass;
  }

}
