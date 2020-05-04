import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-application-onboarding',
  templateUrl: './application-onboarding.component.html',
  styleUrls: ['./application-onboarding.component.less']
})
export class ApplicationOnboardingComponent implements OnInit {

  constructor(public router:Router,
    public store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.store.select('appOnboarding').subscribe(
      (response) => {
        if(response.parentPage === null){
          // navigate to application list as default route
           this.router.navigate(['/setup/applications'])
        }
      }
    )
  }

}
