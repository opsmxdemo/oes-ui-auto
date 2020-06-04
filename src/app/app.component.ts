import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';
import * as LayoutAction from './layout/store/layout.actions';
import * as AuditActions from './audit/store/audit.actions';
import * as PolicyActions from './policy-management/store/policyManagement.actions';
import * as OnboardingActions from './application-onboarding/store/onBoarding.actions';
import * as AppDashboardAction from './application-dashboard/store/dashboard.actions';
import { Menu } from './models/layoutModel/sidenavModel/menu.model';
import { environment } from '../environments/environment'
import * as $ from 'jquery';
import 'bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'OES-UI';
  addclass = false;
  isAuthenticate = false;
  Sidebar: any;
  applicationCount: number;

  constructor(public store: Store<fromApp.AppState>,private router: Router,private route: ActivatedRoute) { }
  // For tooltip
  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
    $('[data-toggle="dropdown"]').dropdown();
  }
  ngOnInit() {

    //Dispatching action for login functionality
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
        }else if(response.authResponse === 'success'){

          //Dispatching action to fetch Sidebar Menu
          this.store.dispatch(new LayoutAction.LoadPage());

          //Dispatching action to fetch application dashboard data from API
          this.store.dispatch(AppDashboardAction.loadAppDashboard());

          //Dispatching action to fetch application Onboarding data from API
          this.store.dispatch(OnboardingActions.loadAppList());

          //Dispatching action to fetch audit initial data
          this.store.dispatch(AuditActions.loadAudit());

          //Dispatching action for policy management initial data
          this.store.dispatch(PolicyActions.loadPolicy({relatedTab:'DYNAMIC'}));

        }
      }
    );

   

    // fetching data from LayoutState
    this.store.select('layout').subscribe(
      (response) => {
        this.Sidebar = [
          {
            "name": "OES Dashboard",
            "id": 1,
            "link": "oesdashboard",
            "subMenu": [],
            "disabled": true
          },
          {
            "name": "Applications",
            "id": 2,
            "link": "/application",
            "subMenu": [
              {
                "name": "Dev Verification",
                "id": 21,
                "link": "DevV",
                "disabled": true
              },
              {
                "name": "Production Monitoring",
                "id": 24,
                "link": "Monitoring",
                "disabled": true
              },
              {
                "name": "Deployment Verification",
                "id": 23,
                "link": "/application/deploymentverification",
                "disabled": false
              }
            ],
            "disabled": false
          },
          {
            "name": "Policy Management",
            "id": 3,
            "link": "policymanagement",
            "subMenu": [],
            "disabled": false
          },
          {
            "name": "Security/Audit",
            "id": 4,
            "link": "audit",
            "subMenu": [],
            "disabled": false
          },
          {
            "name": "System Setup",
            "id": 5,
            "link": "setup",
            "subMenu": [],
            "disabled": false
          },
          {
            "name": "User Setting",
            "id": 6,
            "link": "setting",
            "subMenu": [],
            "disabled": true
          }
        ];
        
       // this.applicationCount = response.appliactionData;
      }
    );
  }

  loginRedirect(callback): void {
    window.location.href = `${environment.endPointUrl}auth/redirectauto?to=${callback}`;
  }

  toggleNavbar() {
    this.addclass = !this.addclass;
  }

  // getData(){
  //   //this.router.navigate(['/appdashboard/deployment'])
  //   this.router.navigate(['deployment'], { relativeTo: this.route });

  // }

}
