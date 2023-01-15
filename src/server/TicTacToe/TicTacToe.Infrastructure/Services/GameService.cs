using TicTacToe.AppCore.Common.DTO;
using TicTacToe.Infrastructure.Persistence;

namespace TicTacToe.Infrastructure.Services;

public class GameService
{
    private readonly ApplicationDbContext _context;

    public GameService(ApplicationDbContext context)
    {
        _context = context;
    }

    public Game Start(GameConnection playerX, List<GameConnection> otherPlayers)
    {
        var playerO = otherPlayers[Random.Shared.Next(otherPlayers.Count - 1)];
        var game = new Game(playerX, playerO);
        return game;
    }
}