using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using TicTacToe.AppCore.Common.DTO;
using TicTacToe.Infrastructure.Services;

namespace TicTacToe.API.Hubs;

public class GameHub : Hub
{
    private readonly IDictionary<string, GameConnection> _gameConnections;
    private readonly GameService _gameService;

    public GameHub(ConcurrentDictionary<string, GameConnection> gameConnections, GameService gameService)
    {
        _gameConnections = gameConnections;
        _gameService = gameService;
    }

    public override async Task OnConnectedAsync()
    {
        await SendAllGames();
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (_gameConnections.TryGetValue(Context.ConnectionId, out var gameConnection))
        {
            _gameConnections.Remove(Context.ConnectionId);
            
            //real-time message from bot
            await Clients
                .Group(gameConnection.GameName)
                .SendAsync("ConnectInfo", "Bot", $"{gameConnection.User} left :(");
            
            await SendConnectedPlayers(gameConnection.GameName);
            await Clients.Caller
                .SendAsync("IsConnectedToGame", false);
            
            await SyncAllGames(gameConnection.GameName);
            
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameConnection.GameName);
        }
        
        await base.OnDisconnectedAsync(exception);
        await SendAllGames();
    }

    public async Task LeaveGame()
    {
        if (_gameConnections.TryGetValue(Context.ConnectionId, out var gameConnection))
        {
            _gameConnections.Remove(Context.ConnectionId);
            
            //real-time message from bot
            await Clients
                .Group(gameConnection.GameName)
                .SendAsync("ConnectInfo", "Bot", $"{gameConnection.User} left :(");
            
            await SendConnectedPlayers(gameConnection.GameName);
            await Clients.Caller
                .SendAsync("IsConnectedToGame", false);
            
            await SyncAllGames(gameConnection.GameName);
            
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameConnection.GameName);
        }
        
        await SendAllGames();
    }

    public async Task AddGame(GameConnection gameConnection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, gameConnection.GameName);
        _gameConnections[Context.ConnectionId] = gameConnection;
        
        //real-time message from bot
        await Clients.All
            .SendAsync("NewGame", gameConnection);
        
        await SendConnectedPlayers(gameConnection.GameName);
        await Clients.Caller
            .SendAsync("IsConnectedToGame", true);
    }
    
    public async Task JoinGame(GameConnection gameConnection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, gameConnection.GameName);
        _gameConnections[Context.ConnectionId] = gameConnection;
        
        //real-time message from bot
        await Clients
            .Group(gameConnection.GameName)
            .SendAsync("ConnectInfo", "Bot", $"{gameConnection.User} here!");

        await SendConnectedPlayers(gameConnection.GameName);
        await Clients.Caller
            .SendAsync("IsConnectedToGame", true);
    }
    
    // game start logic
    public async Task StartGame (GameConnection playerX)
    {
       // playerX - инициализатор игры(надо сделать по дефолту дисэйблед кнопки хода для всех)
       
       // players who wait the chance
       var otherPlayers = _gameConnections
           .Values
           .Where(g => g.GameName == playerX.GameName && g.User != playerX.User)
           .ToList();

       if (otherPlayers.Any())
       {
            var game = _gameService.Start(playerX, otherPlayers);
            await Clients
                .Group(playerX.GameName)
                .SendAsync("CurrentGame", game);
       }

       await Task.CompletedTask;
    }

    public async Task MakeMove(GameMove gameMove)
    {
        // game move logic
    }

    public async Task RefreshRating()
    {
        
    }

    public async Task SendAllGames()
    {
        // send only uniq Games
        var games = _gameConnections.Values.DistinctBy(d => d.GameName);
        await Clients.Caller.SendAsync("GetAllGames", games);
    }

    // if it was last connected player
    public async Task SyncAllGames(string gameName)
    {
        // if it was the last player in the game room - sync the games
        var connectedPlayersNumber = _gameConnections.Values
            .Count(g => g.GameName == gameName);
        if (connectedPlayersNumber == 0)
        {
            var games = _gameConnections.Values.DistinctBy(d => d.GameName);
            await Clients.All.SendAsync("GetAllGames", games);
        }
    }

    public Task SendConnectedPlayers(string gameName)
    {
        var players = _gameConnections.Values
            .Where(g => g.GameName == gameName)
            .Select(s => s.User);
        
        return Clients.Group(gameName).SendAsync("GetConnectedPlayers", players);
    }
    
}