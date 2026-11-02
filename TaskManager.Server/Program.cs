
using Microsoft.EntityFrameworkCore;
using TaskManager.Server.Data;

namespace TaskManager.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Database connection
            var connectionString = builder.Configuration
                .GetConnectionString("DefaultConnection");

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    "Database connection string is missing."
                );
            }

            builder.Services.AddDbContext<TaskManagerDbContext>(options =>
                options.UseMySql(
                    connectionString,
                    new MySqlServerVersion(new Version(8, 5, 3))
                ));

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // CORS - Local and Production
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    var frontendUrl = builder.Configuration["FrontendUrl"];

                    if (!string.IsNullOrWhiteSpace(frontendUrl))
                    {
                        policy.WithOrigins(frontendUrl)
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    }
                });
            });

            var app = builder.Build();

            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI();
            //}
            // Swagger enabled for API testing
            app.UseSwagger();
            app.UseSwaggerUI();

            if (!app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            app.UseCors("AllowFrontend");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
