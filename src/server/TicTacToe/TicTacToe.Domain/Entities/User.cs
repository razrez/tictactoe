using Microsoft.AspNetCore.Identity;

namespace TicTacToe.Domain.Entities;

public sealed class User : IdentityUser
{
    public User()
    {
        Messages = new List<Message>();
    }
    
    public int Rating;
    
    public ICollection<Message> Messages { get; set; }
    
}