import {Component, Input} from '@angular/core';
import {TicTacToeService} from "../../tic-tac-toe.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {userKey} from "../../app.module";

export class Player {
  user: string = '';
  gameName: string = '';
  minimalGameRating!: number;

  constructor(user: string, gameName: string, minimalGameRating: number ) {
    this.user = user;
    this.gameName = gameName;
    this.minimalGameRating = minimalGameRating;
  }

}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  private readonly username:string;

  tictactoe: TicTacToeService;

  youCanMove: boolean = false;
  playerX: Player | undefined;
  playerO: Player | undefined;
  squares: any[] = [];
  xIsNext: boolean = true;
  winner: string | null = null;
  countMoves: number = 0;

  @Input()
  gameName: string = '';

  @Input()
  minimalGameRating!: number;

  @Input()
  gamePlayers: any[] = [];

  get gameIsStarted():boolean {
    return this.tictactoe.gameIsStarted;
  }


  constructor(tictactoe:TicTacToeService,private jwtHelper: JwtHelperService) {
    this.tictactoe = tictactoe;
    this.username = this.jwtHelper.decodeToken()[userKey]
  }

  ngOnInit() {
    this.newGame();
    this.addStartedGameListener();
    this.addSyncGameListener()
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = '';
    this.xIsNext = true;
    this.countMoves = 0;
  }

  addStartedGameListener(){
    this.tictactoe.hubConnection.on("CurrentGame",({playerX, playerO}) =>{
      this.tictactoe.gameIsStarted = true;

      this.playerX = new Player(playerX.user, playerX.gameName, playerX.minimalGameRating);
      this.playerO = new Player(playerO.user, playerO.gameName, playerO.minimalGameRating);

      switch (this.username) {
        case playerX.user:
          this.youCanMove = true;
          console.log("you - X")
          break;

        case playerO.user:
          this.youCanMove = true;
          console.log("you - O")
          break;

        default:
          console.log("u just watch")
      }

      console.log(this.playerX, this.playerO);
    });
  }

  addSyncGameListener(){
    this.tictactoe.hubConnection.on("SyncGameState", (game) => {
      console.log(game);




    })
  }

  async leaveGame(){
    await this.tictactoe.hubConnection.invoke("LeaveGame");
    window.location.reload();
  }

  async startGame(){
    await this.tictactoe.hubConnection.invoke("StartGame", {
      user: this.username,
      gameName: this.gameName,
      minimalGameRating: this.minimalGameRating});
  }
}
