using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using TicTacToe.Domain.Entities;

namespace TicTacToe.API.Hubs;

public class GameHub : Hub
{
    private readonly ConcurrentDictionary<string, GameConnection> _gameConnections;

    public GameHub(ConcurrentDictionary<string, GameConnection> gameConnections)
    {
        _gameConnections = gameConnections;
    }

    public async Task OpenGame(GameConnection gameConnection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, gameConnection.GameName);
        _gameConnections[Context.ConnectionId] = gameConnection;
        
        await Clients.Group(gameConnection.GameName).SendAsync("GameOpened", true);
    }

    public async Task Hey(string name)
    {
        await Clients.All.SendAsync("getHey", $"{name} says hey");
    }
}