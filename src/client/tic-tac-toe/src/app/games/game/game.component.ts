import {Component, Input} from '@angular/core';
import {TicTacToeService} from "../../tic-tac-toe.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {userKey} from "../../app.module";

class Player {
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
  private _countMoves: number = 0;

  youCanMove: boolean = false;
  yourValue: string = '';

  playerX: Player | undefined ;
  playerO: Player | undefined ;

  tictactoe: TicTacToeService;
  squares: any[] = [];
  xIsNext: boolean = true;
  winner: string | null = null;

  @Input()
  gameName: string = '';

  @Input()
  minimalGameRating!: number;

  @Input()
  gamePlayers: any[] = [];

  get gameIsStarted():boolean {
    return this.tictactoe.gameIsStarted;
  }

  get countMoves(): number {
    return this._countMoves;
  }

  constructor(tictactoe:TicTacToeService,private jwtHelper: JwtHelperService) {
    this.tictactoe = tictactoe;
    this.username = this.jwtHelper.decodeToken()[userKey]
  }

  ngOnInit() {
    this.newGame();
    this.addStartedGameListener();
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = '';
    this.xIsNext = true;
    this._countMoves = 0;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number) {
    // if empty or null
    if (!this.winner && this.youCanMove){

      if (!this.squares[idx]) {
        this.squares.splice(idx, 1, this.player);
        this.xIsNext = !this.xIsNext;
        this._countMoves ++;
      }

      this.winner = this.calculateWinner();
    }
  }

  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return this._countMoves === 9 ? 'nobody' : null;
  }

  addStartedGameListener(){
    this.tictactoe.hubConnection.on("CurrentGame",({playerX, playerO}) =>{
      this.tictactoe.gameIsStarted = true;

      this.playerO = new Player(playerX.user, playerO.gameName, playerO.minimalGameRating);
      this.playerX = new Player(playerX.user, playerX.gameName, playerX.minimalGameRating);

      switch (this.username) {
        case playerX.user:
          this.youCanMove = true;
          this.yourValue = "X";
          console.log("you - X")
          break;

        case playerO.user:
          this.youCanMove = true;
          this.yourValue = "O";
          console.log("you - O")
          break;

        default:
          console.log("u just watch")
      }

      console.log(this.playerX, this.playerO);
    });
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
