using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TicTacToe.API.Controllers;

[Authorize]
[ApiController]
[Route("api/games")]
public class GameController : ControllerBase
{
    public GameController()
    {
        
    }
    
    [HttpGet("all")]
    public IActionResult Get()
    {
        return Ok("какая-то доступная информация");
    }
}