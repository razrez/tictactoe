namespace TicTacToe.AppCore.Common.DTO;

public class Game
{
    public GameConnection PlayerX { get; set; }
    public GameConnection PlayerO { get; set; }

    public Game(GameConnection playerX, GameConnection playerO)
    {
        PlayerX = playerX;
        PlayerO = playerO;
    }
    
}