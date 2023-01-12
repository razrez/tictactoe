using System.ComponentModel.DataAnnotations;

namespace TicTacToe.Domain.Entities;

public class GameConnection
{
    public string User { get; set; } = null!;
    public string GameName { get; set; } = null!;
}