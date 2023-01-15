using System.Collections.Concurrent;
using TicTacToe.AppCore.Common.DTO;

namespace TicTacToe.AppCore.Common;

public class GameStates
{
    public ConcurrentDictionary<string, Game> States = new();
}