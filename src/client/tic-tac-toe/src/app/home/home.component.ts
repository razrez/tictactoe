import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {tokenGetter} from "../app.module";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isUserAuthenticated: boolean = false;
  constructor(private router: Router, private jwtHelper: JwtHelperService){
  }

  ngOnInit(){
    this.isUserAuthenticated = !!tokenGetter() && !this.jwtHelper.isTokenExpired(tokenGetter());
  }

  logOut(){
    localStorage.removeItem("jwt");
    this.isUserAuthenticated = false;
    this.router.navigate(["login"]);
  }
}
