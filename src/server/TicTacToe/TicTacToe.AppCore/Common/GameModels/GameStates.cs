using System.Collections.Concurrent;

namespace TicTacToe.AppCore.Common.GameModels;

public class GameStates
{
    public ConcurrentDictionary<string, Game> States = new();
}