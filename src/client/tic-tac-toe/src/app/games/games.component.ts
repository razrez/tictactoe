import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TicTacToeService} from "../tic-tac-toe.service";
import {NgForm} from "@angular/forms";
import {JwtHelperService} from "@auth0/angular-jwt";
import {userKey} from "../app.module";
import {Router} from "@angular/router";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent {
  tictactoe: TicTacToeService;

  gameName: string = '';
  minimalGameRating: number = 0;

  games: any[] = [/*
    {gameName:"game1", minimalGameRating:1},
    {gameName:"game2", minimalGameRating:2},
    {gameName:"game3", minimalGameRating:3},*/
  ];

  private readonly username:string;

  constructor(private http: HttpClient,tictactoe:TicTacToeService,
              private jwtHelper: JwtHelperService, private router:Router) {
    this.tictactoe = tictactoe;
    this.username = this.jwtHelper.decodeToken()[userKey]
  }

  ngOnInit(){
    this.tictactoe.startConnection();

    this.tictactoe.hubConnection.on("GetAllGames", (games) => {
      this.games = games;
    });

    this.tictactoe.hubConnection.on("NewGame",(newGame) => {
      this.games.push(newGame);
    });

    this.tictactoe.hubConnection.on("GetConnectedPlayers", (connectedPlayers) => {
      console.log(connectedPlayers);
    })


    /*this.http.get("https://localhost:5001/api/games/all")
      .subscribe(response => {
        console.log(response);
      }, error => console.log(error))*/
  }

  addGame(){
    this.tictactoe.hubConnection.invoke("AddGame", {
      user: this.username,
      gameName: this.gameName,
      minimalGameRating: this.minimalGameRating});

    this.router.navigate(["/game"])
  }

  joinGame(joinForm: NgForm){

    localStorage.setItem("currentGame", this.gameName)
    /*this.tictactoe.hubConnection.invoke("JoinGame", {
      user: this.username,
      gameName: this.gameName,
      minimalGameRating: this.minimalGameRating});*/

    this.router.navigate(["/game"])
  }


}
