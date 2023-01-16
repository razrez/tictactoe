import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TicTacToeService} from "../tic-tac-toe.service";
import {Game, Player} from "../games/game/game.component";
import {JwtHelperService} from "@auth0/angular-jwt";
import {userKey} from "../app.module";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  private readonly username:string;

  tictactoe: TicTacToeService;

  @Input() playerX: Player | undefined;

  @Input() playerO: Player | undefined;

  @Input() youCanMove: boolean = false;
  @Output() youCanMoveChange = new EventEmitter<boolean>();

  @Input() squares: any[] = [];
  @Input() xIsNext: boolean = true;
  @Input() winner: string | undefined | null = null;
  @Input() countMoves: number = 0;

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  currentPlayerName(){
    return this.xIsNext ? this.playerX?.user : this.playerO?.user;
  }

  constructor(tictactoe:TicTacToeService, private jwtHelper: JwtHelperService) {
    this.tictactoe = tictactoe;
    this.username = this.jwtHelper.decodeToken()[userKey]
  }

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = '';
    this.xIsNext = true;
    this.countMoves = 0;

    this.tictactoe.hubConnection.invoke("StartGame",{
      user: this.username,
      gameName: this.playerX?.gameName,
      minimalGameRating: this.playerX?.minimalGameRating
    });

    /*this.tictactoe.hubConnection.invoke("RefreshRating", {
      winner: this.winner,
      gameName: this.playerX?.gameName
    });*/

  }

  async makeMove(idx: number) {
    // if no winner and you can do moves
    if (!this.winner && this.youCanMove){

      if (!this.squares[idx]) {
        this.squares.splice(idx, 1, this.player);
        this.xIsNext = !this.xIsNext;
        this.countMoves ++;
        this.youCanMove = !this.youCanMove;
        this.youCanMoveChange.emit(this.youCanMove);
      }

      this.winner = this.calculateWinner();
      await this.tictactoe.hubConnection.invoke("MakeMove",
        new Game(this.playerX, this.playerO, this.squares, this.xIsNext, this.winner, this.countMoves
      ));
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
        return this.squares[a] === "X" ? this.playerX?.user : this.playerO?.user;
      }
    }
    return this.countMoves === 9 ? 'nobody' : null;
  }


}
