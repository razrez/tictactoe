using Microsoft.AspNetCore.Identity;
using TicTacToe.AppCore.Common.GameModels;
using TicTacToe.Domain.Entities;
using TicTacToe.Infrastructure.Persistence;

namespace TicTacToe.Infrastructure.Services;

public class GameService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public GameService(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public Game Start(GameConnection playerX, List<GameConnection> otherPlayers)
    {
        var playerO = otherPlayers[Random.Shared.Next(otherPlayers.Count - 1)];
        var game = new Game(playerX, playerO);
        return game;
    }

    public async Task RefreshRating(GameResult gameResult)
    {
        var loserUser = await _userManager.FindByNameAsync(gameResult.LoserName);
        var winnerUser = await _userManager.FindByNameAsync(gameResult.WinnerName);

        loserUser.Rating -= 1;
        winnerUser.Rating += 3;

        await _userManager.UpdateAsync(loserUser);
        await _userManager.UpdateAsync(winnerUser);
    }

    public async Task<List<PlayerStatistic>> GetStatisticsByPlayers(List<string> playerNames)
    {
        var res = new List<PlayerStatistic>();
        foreach (var playerName in playerNames)
        {
            var userInfo = await _userManager.FindByNameAsync(playerName);
            var userStat = new PlayerStatistic(playerName, userInfo.Rating);
            res.Add(userStat);
        }

        return res;
    }
}