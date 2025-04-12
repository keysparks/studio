csharp
using Microsoft.EntityFrameworkCore;

namespace FinancialAPI.Data
{
    public interface ITransaction
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Username { get; set; }
    }

    public class FinancialDbContext : DbContext
    {
        public FinancialDbContext(DbContextOptions<FinancialDbContext> options)
            : base(options)
        {
        }

        public DbSet<Revenue> Revenues { get; set; }
        public DbSet<Expense> Expenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Revenue>().ToTable("Revenues");
            modelBuilder.Entity<Expense>().ToTable("Expenses");
        }
    }
    
    public class Revenue : ITransaction
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Username { get; set; }
    }

    public class Expense : ITransaction
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Username { get; set; }
    }
}