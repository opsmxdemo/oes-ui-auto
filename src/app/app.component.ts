import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';
import * as LayoutAction from './layout/store/layout.actions';
import * as AppOnboardingAction from './application-onboarding/store/onBoarding.actions';
import { Menu } from './models/layoutModel/sidenavModel/menu.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'OES-UI';
  addclass = false;
  isAuthenticate = false;
  Sidebar:Menu;
  
  constructor( public store:Store<fromApp.AppState>){}
  ngOnInit(){
    
    //Dispatching action to fetch Sidebar Menu
    this.store.dispatch(new LayoutAction.LoadPage());

    //Dispatching action for autoLogin functionality
    this.store.dispatch(new AuthAction.AutoLoginStart());

    //Dispatching action for pipelineData functionality
    this.store.dispatch(AppOnboardingAction.loadApp());

    //fetching data from AuthState
    this.store.select('auth').subscribe(
      (response) => {
          this.isAuthenticate = response.authenticated;
      }
    );

    // fetching data from LayoutState
    this.store.select('layout').subscribe(
      (response) => {
          this.Sidebar = response.menu;
      }
    );
  }
  toggleNavbar(){
    this.addclass = !this.addclass;
  }
 
}
