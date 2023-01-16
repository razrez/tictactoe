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

export class Game{
  playerX: Player | undefined;
  playerO: Player | undefined;
  squares: any[] = [];
  xIsNext: boolean = true;
  winner: string | undefined | null = null;
  countMoves: number = 0;

  constructor(playerX: Player | undefined, playerO: Player | undefined, squares: any[],
              xIsNext: boolean, winner: string | undefined | null, countMoves: number) {
    this.playerX = playerX;
    this.playerO = playerO;
    this.squares = squares;
    this.xIsNext = xIsNext;
    this.winner = winner;
    this.countMoves = countMoves;
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
  winner: string | undefined | null = null;
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

  constructor(tictactoe:TicTacToeService, private jwtHelper: JwtHelperService) {
    this.tictactoe = tictactoe;
    this.username = this.jwtHelper.decodeToken()[userKey]
  }

  ngOnInit() {
    this.newGame();
    this.addStartedGameListener();
    this.addSyncGameListener();
    this.addStopGameListener();
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = '';
    this.xIsNext = true;
    this.countMoves = 0;
  }

  addStartedGameListener(){
    this.tictactoe.hubConnection.on("NewGame",({playerX, playerO}) =>{
      this.tictactoe.gameIsStarted = true;
      this.tictactoe.gameIsStartedChange.emit(true);

      this.playerX = new Player(playerX.user, playerX.gameName, playerX.minimalGameRating);
      this.playerO = new Player(playerO.user, playerO.gameName, playerO.minimalGameRating);

      switch (this.username) {
        case playerX.user:
          this.youCanMove = true;
          console.log("you - X")
          break;

        case playerO.user:
          this.youCanMove = false; // X - always first
          console.log("you - O")
          break;

        default:
          console.log("u just watch")
      }

      console.log(this.playerX, this.playerO);
      this.newGame();
    });
  }

  addSyncGameListener(){
    this.tictactoe.hubConnection.on("SyncGameState", (game:Game) => {

      this.playerX = game.playerX;
      this.playerO = game.playerO;
      this.squares = game.squares;
      this.xIsNext = game.xIsNext;
      this.winner = game.winner;
      this.countMoves = game.countMoves;


      this.youCanMove = (this.username === this.playerX?.user && this.xIsNext )
        || (this.username === this.playerO?.user && !this.xIsNext);

      if(this.gameIsStarted){
        this.tictactoe.gameIsStarted = true;
        this.tictactoe.gameIsStartedChange.emit(true);
      }
      console.log(game);
    })

  }

  addStopGameListener(){
    this.tictactoe.hubConnection.on("GameIsStarted", (gameIsStarted) =>  {
      this.tictactoe.gameIsStarted = gameIsStarted;
      this.tictactoe.gameIsStartedChange.emit(this.gameIsStarted);
      //this.newGame();
    });
  }

  async leaveGame(){
    await this.tictactoe.hubConnection.invoke("LeaveGame");

    if (this.username===this.playerX?.user || this.username===this.playerO?.user){
      await this.tictactoe.hubConnection.invoke("StopGame",{
        user: this.username,
        gameName: this.gameName,
        minimalGameRating: this.minimalGameRating});
    }

    window.location.reload();
  }

  async startGame(){
    await this.tictactoe.hubConnection.invoke("StartGame", {
      user: this.username,
      gameName: this.gameName,
      minimalGameRating: this.minimalGameRating});
  }
}
