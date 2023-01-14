import {Component, Input} from '@angular/core';
import {TicTacToeService} from "../../tic-tac-toe.service";

@Component({
  selector: 'game-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  tictactoe: TicTacToeService;

  gameName: string = '';
  minimalGameRating: number = 0;

  constructor(tictactoe:TicTacToeService) {
    this.tictactoe = tictactoe;

  }


  createGame(){
    this.tictactoe.sayHey("rus");
  }

}
