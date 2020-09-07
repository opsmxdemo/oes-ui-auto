import { Component, OnInit } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-app-error-listing',
  templateUrl: './app-error-listing.component.html',
  styleUrls: ['./app-error-listing.component.less']
})
export class AppErrorListingComponent implements OnInit {

  appLevelError = false;

  constructor(public store: Store<fromApp.AppState>) { }

  ngOnInit(){}
}
