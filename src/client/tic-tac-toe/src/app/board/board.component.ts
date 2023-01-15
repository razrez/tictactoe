import {Component, Input} from '@angular/core';
import {TicTacToeService} from "../tic-tac-toe.service";
import {Player} from "../games/game/game.component";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {

  tictactoe: TicTacToeService;

  @Input() playerX: Player | undefined;
  @Input() playerO: Player | undefined;
  @Input() youCanMove: boolean = false;
  @Input() squares: any[] = [];
  @Input() xIsNext: boolean = true;
  @Input() winner: string | null = null;
  @Input() countMoves: number = 0;

  get player() {
    return this.xIsNext ? 'X' : 'O';
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
    this.countMoves = 0;

    //this.tictactoe.hubConnection.invoke("NewGame");
  }

  async makeMove(idx: number) {
    // if no winner and you can't do moves
    if (!this.winner && this.youCanMove){

      if (!this.squares[idx]) {
        this.squares.splice(idx, 1, this.player);
        this.xIsNext = !this.xIsNext;
        this.countMoves ++;
      }

      this.winner = this.calculateWinner();

      //await this.tictactoe.hubConnection.invoke("MakeMove", move);
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
    return this.countMoves === 9 ? 'nobody' : null;
  }


}
