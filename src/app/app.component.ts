import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';

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
