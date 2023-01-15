import {Injectable, Input} from '@angular/core';
import * as signalR from '@aspnet/signalr';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from '@aspnet/signalr';

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

  private _hubConnection!: signalR.HubConnection;
  @Input() gameIsStarted = false;
  @Input() gameIsOpened = false;

  public startConnection = () => {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5001/game', HttpTransportType.WebSockets)
      .build();
    this._hubConnection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log(err));
  }

  public closeConnection = async () => {
    try {
      await this._hubConnection.stop()
    }

    catch (e) {
      console.log(e);
    }
  }

  public sayHey = (name:string) =>
    this.hubConnection.invoke("Hey", name);


  constructor() { }
}
