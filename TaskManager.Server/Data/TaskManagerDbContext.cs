
using Microsoft.EntityFrameworkCore;
using TaskManager.Server.Models;

namespace TaskManager.Server.Data
{
    public class TaskManagerDbContext : DbContext
    {
        public TaskManagerDbContext(DbContextOptions<TaskManagerDbContext> options)
            : base(options)
        {
        }

        public DbSet<TaskItem> Tasks { get; set; }
    }
}
