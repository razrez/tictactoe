namespace TicTacToe.AppCore.Common.GameModels;

public class GameConnection
{
    public string User { get; set; } = null!;
    public string GameName { get; set; } = null!;
    public int MinimalGameRating { get; set; }
}