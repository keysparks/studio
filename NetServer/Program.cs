csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using FinancialAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<FinancialDbContext>(options =>
    options.UseInMemoryDatabase("FinancialDatabase"));

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3001")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors();

// Define minimal APIs

// Get all revenues
app.MapGet("/api/revenues", async (FinancialDbContext db) =>
    await db.Revenues.ToListAsync());

// Get a revenue by ID
app.MapGet("/api/revenues/{id}", async (int id, FinancialDbContext db) =>
    await db.Revenues.FindAsync(id) is Revenue revenue ? Results.Ok(revenue) : Results.NotFound());

// Add a new revenue
app.MapPost("/api/revenues", async (ITransaction revenue, FinancialDbContext db) =>
{
    revenue.Id = GenerateId();
    db.Revenues.Add(revenue);
    await db.SaveChangesAsync();

    return Results.Created($"/api/revenues/{revenue.Id}", revenue);
});

// Get all expenses
app.MapGet("/api/expenses", async (FinancialDbContext db) =>
    await db.Expenses.ToListAsync());

// Get an expense by ID
app.MapGet("/api/expenses/{id}", async (int id, FinancialDbContext db) =>
    await db.Expenses.FindAsync(id) is Expense expense ? Results.Ok(expense) : Results.NotFound());

// Add a new expense
app.MapPost("/api/expenses", async (ITransaction expense, FinancialDbContext db) =>
{
    expense.Id = GenerateId();
    db.Expenses.Add((Expense) expense);
    await db.SaveChangesAsync();

    return Results.Created($"/api/expenses/{expense.Id}", expense);
});

// Get all transactions
app.MapGet("/api/transactions", async (FinancialDbContext db) =>
{
    var transactions = await db.Revenues.Cast<ITransaction>()
        .Concat(db.Expenses.Cast<ITransaction>())
        .OrderByDescending(t => t.Date)
        .ToListAsync();

    return transactions;
});




app.Run();





static int GenerateId()
{
    //Basic implementation for unique ID generation
    //In real app, use a proper ID generation strategy
    return Guid.NewGuid().GetHashCode();
}