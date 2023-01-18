using System.Collections.Concurrent;
using TicTacToe.API.Hubs;
using TicTacToe.AppCore.Common;
using TicTacToe.AppCore.Common.GameModels;
using TicTacToe.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policyBuilder => policyBuilder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .SetIsOriginAllowed(_ => true));
});

builder.Services.AddSignalR();

builder.Services.AddSingleton(_ => new ConcurrentDictionary<string, GameConnection>());
builder.Services.AddSingleton<GameStates>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<GameHub>("/game");

app.Run();