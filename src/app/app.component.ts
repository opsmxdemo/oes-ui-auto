import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';
import * as LayoutAction from './layout/store/layout.actions';
import { Menu } from './models/layoutModel/sidenavModel/menu.model';
import {environment} from '../environments/environment'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'OES-UI';
  addclass = false;
  isAuthenticate = false;
  Sidebar:Menu[] = [
    {
        name: "OES Dashboard",
        id: 1,
        link: "oesdashboard",
        subMenu:[]
    },
    {
        name: "App Dashboard",
        id: 2,
        link: "appdashboard",
        subMenu: [
            {
                name: "Dev Verification",
                id: 21,
                link: "DevV"
            },
            {
                name: "Test Verfication",
                id: 22,
                link: "TestV"
            },
            {
                name: "Deployment Verification",
                id: 23,
                link: "DeployV"
            },
            {
                name: "Production Monitoring",
                id: 24,
                link: "Monitoring"
            }
        ]
    },
    {
        name: "Policy Management",
        id: 3,
        link: "management",
        subMenu:[]
    },
    {
        name: "Security/Audit",
        id: 4,
        link: "audit",
        subMenu:[]
    },
    {
        name: "System Setup",
        id: 5,
        link: "setup",
        subMenu:[]
    },
    {
        name: "User Setting",
        id: 6,
        link: "setting",
        subMenu:[]
    }
];
  
  constructor( public store:Store<fromApp.AppState>){}
  ngOnInit(){
    
    //Dispatching action to fetch Sidebar Menu
    this.store.dispatch(new LayoutAction.LoadPage());

    //Dispatching action for autoLogin functionality
    this.store.dispatch(new AuthAction.AutoLoginStart());

    //fetching data from AuthState
    this.store.select('auth').subscribe(
      (response) => {
          this.isAuthenticate = response.authenticated;
      }
    );

    //fetching data from LayoutState
    // this.store.select('layout').subscribe(
    //   (response) => {
    //       this.Sidebar = response.menu;
    //   }
    // );
  }
  toggleNavbar(){
    this.addclass = !this.addclass;
  }
 
}
