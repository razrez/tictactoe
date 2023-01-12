using Microsoft.AspNetCore.Mvc;

namespace TicTacToe.API.Controllers;

[ApiController]
[Route("[controller]")]
public class GameController : ControllerBase
{

    
    public GameController()
    {
    }

    [HttpGet("api/get")]
    public IActionResult Get()
    {
        return Ok();
    }
}