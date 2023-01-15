import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TicTacToeService} from "../tic-tac-toe.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {userKey} from "../app.module";
import {Router} from "@angular/router";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent {

  private readonly username:string;
  tictactoe: TicTacToeService;

  gameName: string = '';
  minimalGameRating: number = 0;
  gameIsOpened: boolean = false;
  gamePlayers: any[] = [];
  games: any[] = [];


  constructor(private http: HttpClient,tictactoe:TicTacToeService,
              private jwtHelper: JwtHelperService, private router:Router) {
    this.tictactoe = tictactoe;
    this.username = this.jwtHelper.decodeToken()[userKey]
  }

  ngOnInit(){
    this.tictactoe.startConnection();

    this.tictactoe.hubConnection.onclose(_ => {
      this.tictactoe.gameIsOpened = false;
      this.gameIsOpened = false;
    });


    this.tictactoe.hubConnection.on("GetAllGames", (games) => {
      this.games = games;
    });

    this.tictactoe.hubConnection.on("NewGame",(newGame) => {
      this.games.push(newGame);
    });

    this.tictactoe.hubConnection.on("ConnectInfo", (bot,connectInfo) => {
      console.log(bot + ":", connectInfo);
    });

    // wait if connection to game changes
    this.tictactoe.hubConnection.on("IsConnectedToGame",
      (isConnected) => {
        this.tictactoe.gameIsOpened = isConnected;
        this.gameIsOpened = isConnected;
      });

    // needs to monitor in real-time list of connected players to the game
    this.tictactoe.hubConnection.on("GetConnectedPlayers", (connectedPlayers) => {
      console.log(connectedPlayers);
      this.gamePlayers = connectedPlayers;
    });

    /*this.http.get("https://localhost:5001/api/games/all")
      .subscribe(response => {
        console.log(response);
      }, error => console.log(error))*/
  }

  async addGame(){
    await this.tictactoe.hubConnection.invoke("AddGame", {
      user: this.username,
      gameName: this.gameName,
      minimalGameRating: this.minimalGameRating});
  }

  async joinGame(gameName: string, minimalGameRating: number){
    if(!this.tictactoe.gameIsOpened){
      this.gameName = gameName;
      this.minimalGameRating = minimalGameRating;

      await this.tictactoe.hubConnection.invoke("JoinGame", {
        user: this.username,
        gameName: gameName,
        minimalGameRating: minimalGameRating
      });
    }

    else{
      alert("page will reload");
      window.location.reload();
    }
  }

}
