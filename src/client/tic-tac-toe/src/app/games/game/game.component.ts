import {Component, Input} from '@angular/core';
import {TicTacToeService} from "../../tic-tac-toe.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  private _countMoves: number = 0;

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

  constructor(tictactoe:TicTacToeService) {
    this.tictactoe = tictactoe;
  }

  ngOnInit() {
    this.newGame();
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
    if (!this.winner){

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

}
