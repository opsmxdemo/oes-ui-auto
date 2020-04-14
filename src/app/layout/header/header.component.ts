import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthAction from '../../auth/store/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  isAuthenticate: Boolean;
  username:string;

  constructor(public store: Store<fromApp.AppState>,
              public router: Router) { }

  ngOnInit() {
    //fetching data from Auth state
    this.store.select('auth').subscribe(
      (response) => {
          this.isAuthenticate = response.authenticated;
          this.username = response.user;
      }
    );
  }

  onLogout(){
    this.store.dispatch(new AuthAction.Logout())
    // this.router.navigate(['/login']);
  }

}
