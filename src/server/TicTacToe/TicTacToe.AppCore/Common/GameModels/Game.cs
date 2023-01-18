namespace TicTacToe.AppCore.Common.GameModels;

public class Game
{
    public GameConnection PlayerX { get; set; }
    public GameConnection PlayerO { get; set; }
    
    public List<string> Squares { get; set; }
    public string Winner { get; set; }
    public int CountMoves { get; set; }
    public bool XIsNext { get; set; }

    public Game()
    {
        XIsNext = false;
    }

    public Game(GameConnection playerX, GameConnection playerO)
    {
        PlayerX = playerX;
        PlayerO = playerO;
    }
    
}