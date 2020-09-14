import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthAction from '../../auth/store/auth.actions';
import { Router } from '@angular/router';
import * as versionDetails from '../../../assets/data/versionDetails.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  isAuthenticate: Boolean;
  userDetails: any;
  imgcolor: string = '#00796b';
  firstAlphabet: any;
  username: string;
  versionDetails:any=versionDetails
 

  constructor(public store: Store<fromApp.AppState>,
              public router: Router) { }

  ngOnInit() {
    this.getRandomColor();
    //fetching data from Auth state
    this.store.select('auth').subscribe(
      (response) => {
        if(response.authenticated){
          this.isAuthenticate = response.authenticated;
          this.username = response.user;
          this.firstAlphabet = this.username.split('');
        }
      }
    );
    
  }

  onLogout(){
    localStorage.removeItem('userData');
    this.isAuthenticate = false;
    this.store.dispatch(new AuthAction.Logout())
  }

  //Below function is use to get random color for user image
  getRandomColor() {
    var characters = "0123456789ABCDEF";
    var color = '#';
  
    for (var i = 0; i < 6; i++) {
      color += characters[this.getRandomNumber(0, 15)];
    }
    this.imgcolor = color;
  }
  
  // Below function is use to generate random number for getcolor method.
  getRandomNumber(low, high) {
    var r = Math.floor(Math.random() * (high - low + 1)) + low;
    return r;
  }

}
