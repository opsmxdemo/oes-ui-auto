import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'OES-UI';
  addclass = false;
  isAuthenticate = false;
  
  constructor( public store:Store<fromApp.AppState>){}
  ngOnInit(){
    //Dispatching action for autoLogin functionality
    this.store.dispatch(new AuthAction.AutoLoginStart());

    //fetching data from AuthState
    this.store.select('auth').subscribe(
      (response) => {
          this.isAuthenticate = response.authenticated;
      }
    );
  }
  toggleNavbar(){
    this.addclass = !this.addclass;
  }
 
}
