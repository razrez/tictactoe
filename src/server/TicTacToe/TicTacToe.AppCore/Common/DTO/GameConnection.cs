namespace TicTacToe.AppCore.Common.DTO;

public class GameConnection
{
    public string User { get; set; } = null!;
    public string GameName { get; set; } = null!;
    public int MinimalGameRating { get; set; }
}