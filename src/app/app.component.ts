import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';
import * as LayoutAction from './layout/store/layout.actions';
import * as AuditActions from './audit/store/audit.actions';
import * as CdDashboardActions from './cd-dashboard/store/cd-dashboard.actions';
import * as PolicyActions from './policy-management/store/policyManagement.actions';
import * as OnboardingApplicationActions from './application-onboarding/application/store/application.actions';
import * as DataSourceActions from './application-onboarding/data-source/store/data-source.actions';
import * as AppDashboardAction from './application/application-dashboard/store/dashboard.actions';
import * as DeploymentVerificationAction from './application/deployment-verification/store/deploymentverification.actions';
import { Menu } from './models/layoutModel/sidenavModel/menu.model';
import * as $ from 'jquery';
import 'bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfigService } from './services/app-config.service';
import { Location } from '@angular/common';
import { faTachometerAlt, faProjectDiagram, faChartPie, faVectorSquare, faShippingFast, faTasks, faDraftingCompass, faCube, faStethoscope, faLock, faMarsStrokeH, faMask, faCompactDisc, faGavel, faStroopwafel } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'OES';
  addclass = false;
  isAuthenticate = false;
  apiError = false;
  Sidebar: any;
  applicationCount: number = 0;
  endpointUrl: string;
  hideTooltip: boolean = true;
  approvalGateInstanceCount: string;
  featureList: any;
  toggleChild: any = [];

  constructor(public store: Store<fromApp.AppState>,
              private router: Router,
              private route: ActivatedRoute,
              public environment: AppConfigService,
              private location: Location) {
                this.endpointUrl = environment.config.endPointUrl;
                console.log(location.path())
                localStorage.setItem('currentUrl', location.path());
               }
  // For tooltip
  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
    $('[data-toggle="dropdown"]').dropdown();
    $('[data-toggle="popover"]').popover();

    //Fix for multiple sticky tooltips
    if($('body').find('.tooltip-inner').length > 1){
      const removeElements = (elms) => elms.forEach(el => el.remove());
      removeElements( document.querySelectorAll(".tooltip.fade") );
    }
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
          let redirectTo = localStorage.getItem('currentUrl') ? localStorage.getItem('currentUrl') : "/application";
          var resultUrl = arr[0] + "//" + arr[2] + redirectTo;
          var encodedUrl = encodeURIComponent(resultUrl);
          this.loginRedirect(encodedUrl)
        }else if(response.authResponse === 'success'){

          //Dispatching action to fetch Sidebar Menu
          this.store.dispatch(new LayoutAction.LoadPage());

          //Dispatching action to fetch application dashboard data from API
          this.store.dispatch(AppDashboardAction.loadAppDashboard());

          //Dispatching action to fetch Cd dashboard data from API
          this.store.dispatch(CdDashboardActions.loadCdDashboard());

          //Dispatching action to fetch application Onboarding data from API
          this.store.dispatch(OnboardingApplicationActions.loadAppList());

          //Dispatch action to fetch Supported Data Source data from API  
          this.store.dispatch(DataSourceActions.loadDatasource());

          // Below function is use to dispatch action based on featureType

          setTimeout(() => {
            this.initialData();
          }, 4000)
        }
      }
    );

    // fetching data from LayoutState
    this.store.select('layout').subscribe(
      (response) => {
        if(this.isAuthenticate){
          this.Sidebar = response.menu;
          if (this.Sidebar) {
            this.toggleChild = [];
            this.Sidebar.forEach(m => {
              this.toggleChild.push(true);
            });
          }
          this.applicationCount = response.appliactionData;
           this.featureList = response.supportedFeatures;
          this.approvalGateInstanceCount = response.approvalInstalgateCount;
          if(response.apiErrorCollection.indexOf(true) > -1){
            this.apiError = true;
            this.router.navigate(['error']);
          }else{
            const url = this.router.url;
            if(url.includes('error')){
              this.apiError = false;
              if(localStorage.getItem('currentUrl')) {
                this.router.navigate([localStorage.getItem('currentUrl')]);
              } else {
                this.router.navigate(['application']);
              }
            }
          }
        }
      }
    );

    // fetching data from application dashboard State
    this.store.select('appDashboard').subscribe(
      (response) => {
        if(response.appData !== null){
          this.store.dispatch(new LayoutAction.ApplicationData(response.appData.length));
        }
      }
    )
     
    // fetching current route if deploymentVerification is exist then collapse left side menu.
    setTimeout(()=>{
      if(this.router.url.includes('deploymentverification')){
        // this.addclass = true;
        this.hideTooltip=false;
      }
    },1000)
  }

  // Dispatch actions to fetch initial data of component based on featureType.
  initialData() {
    if (this.featureList.includes('sapor')) {
      this.store.dispatch(AuditActions.loadAudit());

      //Dispatching action for policy management initial data
      this.store.dispatch(PolicyActions.loadPolicy({ relatedTab: 'DYNAMIC' }));
    }

  }
 

  loginRedirect(callback): void {
    window.location.href = `${this.endpointUrl}auth/redirectauto?to=${callback}`;
  }

  toggleNavbar() {
    this.addclass = !this.addclass;
    this.hideTooltip = !this.addclass
    //this.store.dispatch(new LayoutAction.SideBarToggle(!this.addclass === false?'false':'true'));
  }

  // Below function is use to nevigate to proper page while click on submenu link
  navigateMenu(event,menuName){
    event.stopPropagation();
    if (menuName === 'Deployment Verification' || menuName === 'Trend Analysis') {
      setTimeout(() => {
        // this.addclass = true;
      }, 1000)
    }
  }

  

  // Below function is use ro disabled link by checking featureType 
  disabledLink(linkName) {
    let className = 'disabled_menu';
    let deployment_verification = ['Dashboard', 'Verification Dashboard', 'Continuous Verification', 'Deployment', 'Trend Analysis', 'System Setup'];
    let visibility = ['Dashboard', 'Verification Dashboard', 'Continuous Delivery', 'Visibility and Approval', 'System Setup'];
    let sapor = ['Dashboard', 'Verification Dashboard', 'CD Dashboard', 'Continuous Delivery', 'Security', 'System Setup', 'Audit Trail', 'Compliance', 'Policy Management'];

    if (this.featureList && this.featureList.includes('deployment_verification')) {
      if (deployment_verification.includes(linkName)) {
        className = '';
      }
    } else {
      className = '';
    }
    if (this.featureList && this.featureList.includes('visibility')) {
      if (visibility.includes(linkName)) {
        className = '';
      }
    }
    if (this.featureList && this.featureList.includes('sapor')) {
      if (sapor.includes(linkName)) {
        className = '';
      }
    }
    return className;
  }

  // Below function is use to return appropriate class for submenu link
  subMenuclass(link){
    const linkArr = link.split('/');
    let linkClass = linkArr[linkArr.length-1];
    return linkClass;
  }

  // Below function is returning css class active if current link is selected
  activeRoutes(linkName){
    const currentUrl = this.router.url;
    const selectedLink = currentUrl.split('/');
    const recivedLink = linkName.split('/');
    let returnClass = '';
    let subFactor = 0;

    // Below logic is use to deal with dynamic prams present in routes
    if (+selectedLink[selectedLink.length - 1] > 0) {
      subFactor = 3;
    } else {
      subFactor = 1;
    }

    if(recivedLink[recivedLink.length-1] === selectedLink[selectedLink.length-subFactor]){
      returnClass = 'active';
    }else{
      returnClass = '';
    }

    // Below logic is use to deal with setup links which is exception case
    if(linkName.includes('setup') && currentUrl.includes('setup')){
      returnClass = 'active';
    }
    return returnClass;
  }

  menuIcons(name: any) {
    let className: any = '';
    switch (name) {
      case 'Dashboard':
        className = faTachometerAlt;
        break;
      case 'CD Dashboard':
        className = faProjectDiagram;
        break;
      case 'Analytics':
        className = faChartPie;
        break;
      case 'Collaboration':
        className = faVectorSquare;
        break;
      case 'Continuous Delivery':
        className = faShippingFast;
        break;
      case 'Release Manager':
        className = faTasks;
        break;
      case 'Continuous Verification':
        className = faDraftingCompass;
        break;
      case 'Build':
        className = faCube;
        break;
      case 'Test':
        className = faStethoscope;
        break;
      case 'Security':
        className = faLock;
        break;
      case 'Access Management':
        className = faMarsStrokeH;
        break;
      case 'Secret Management':
        className = faMask;
        break;
      case 'Compliance':
        className = faCompactDisc;
        break;
      case 'Governance':
        className = faGavel;
        break;
      case 'Production':
        className = faStroopwafel;
        break;
    }
    return className;
  }

  toggleSubMenu(index, link) {
    if(link) {
      this.router.navigate([link]);
    } else {
      this.toggleChild[index] = !this.toggleChild[index];
    }
  }

  showChildMenu(SideMenu: any, i: any) {
    return SideMenu.subMenu.length != 0 && this.toggleChild[i];
    // return true;
  }
}
