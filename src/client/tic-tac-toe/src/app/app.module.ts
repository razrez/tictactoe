import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RouterModule, RouterOutlet} from "@angular/router";
import { SquareComponent } from './square/square.component';
import { BoardComponent } from './board/board.component';
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {TicTacToeService} from "./tic-tac-toe.service";
import {JwtModule} from "@auth0/angular-jwt";
import {HttpClientModule} from "@angular/common/http";
import {AuthGuard} from "../auth-guard.service";
import { GamesComponent } from './games/games.component';
import { SignupComponent } from './signup/signup.component';
import { GameComponent } from './games/game/game.component';

export function tokenGetter(){
  return localStorage.getItem("jwt");
}

export const userKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

@NgModule({
  declarations: [
    AppComponent,
    SquareComponent,
    BoardComponent,
    LoginComponent,
    HomeComponent,
    GamesComponent,
    SignupComponent,
    GameComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent, canActivate: [AuthGuard]},
      {path: 'login', component: LoginComponent},
      {path: 'signup', component: SignupComponent},
      {path: 'games', component: GamesComponent, canActivate: [AuthGuard]},
    ]),
    JwtModule.forRoot({
      config:{
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [TicTacToeService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
