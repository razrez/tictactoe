using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using TicTacToe.Domain.Entities;

namespace TicTacToe.Infrastructure.Persistence;

public sealed class ApplicationDbContext : IdentityDbContext<User>
{
    public DbSet<Message> Messages { get; set; } = null!;
    
    public ApplicationDbContext(){}
    
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
        Database.MigrateAsync();
        //Database.EnsureCreated();
    }
    
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}