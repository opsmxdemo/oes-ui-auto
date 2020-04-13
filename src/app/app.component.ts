import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';
import * as LayoutAction from './layout/store/layout.actions';
import * as AppOnboardingAction from './application-onboarding/store/onBoarding.actions';
import { Menu } from './models/layoutModel/sidenavModel/menu.model';
import { Router } from '@angular/router';
import {environment} from '../environments/environment.prod'
import { take } from 'rxjs/operators';

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
  
  constructor( public store:Store<fromApp.AppState>,
    public router:Router){}
  ngOnInit(){
    console.log('loaction',window.location.href);
    console.log('loaction router',this.router.url);
    

    //Dispatching action to fetch Sidebar Menu
    this.store.dispatch(new LayoutAction.LoadPage());

    //Dispatching action for autoLogin functionality
    this.store.dispatch(new AuthAction.SamlLoginStart());

    //Dispatching action for pipelineData functionality
    this.store.dispatch(AppOnboardingAction.loadApp());

    //fetching data from AuthState
    this.store.select('auth').pipe(take(2)).subscribe(
      (response) => {
          this.isAuthenticate = response.authenticated;
          if(response.samlResponse === null){
            if(localStorage.getItem('val') !== 'true'){
              localStorage.setItem('val','true')
              var browserUrl = window.location.href;
                        var arr = browserUrl.split("/");
                        var resultUrl = arr[0] + "//" + arr[2] + "/appdashboard";
                        var encodedUrl = encodeURIComponent(resultUrl);
                        this.loginRedirect(encodedUrl)
            }
            
          }
      }
    );

    // fetching data from LayoutState
    this.store.select('layout').subscribe(
      (response) => {
          this.Sidebar = response.menu;
      }
    );
  }

  loginRedirect(callback): void {
    window.location.href = `${environment.samlUrl}auth/redirectauto?to=${callback}`;
  }

  toggleNavbar(){
    this.addclass = !this.addclass;
  }
 
}
