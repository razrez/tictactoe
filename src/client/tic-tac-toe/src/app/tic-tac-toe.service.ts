import {Injectable, Input} from '@angular/core';
import * as signalR from '@aspnet/signalr';
import {HubConnection, HubConnectionBuilder} from "@aspnet/signalr";

@Injectable({
  providedIn: 'root'
})

export class TicTacToeService {
  get hubConnection(): HubConnection {
    return this._hubConnection;
  }

  set hubConnection(value: HubConnection) {
    this._hubConnection = value;
  }

  get gameIsStarted(): boolean {
    return this._gameIsStarted;
  }

  set gameIsStarted(value: boolean) {
    this._gameIsStarted = value;
  }

  private _hubConnection!: signalR.HubConnection;
  @Input() private _gameIsStarted = false;

  public startConnection = () => {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/game')
      .build();
    this._hubConnection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log(err));
  }

  public sayHey = (name:string) =>
    this.hubConnection.invoke("Hey", name);

  constructor() { }
}
