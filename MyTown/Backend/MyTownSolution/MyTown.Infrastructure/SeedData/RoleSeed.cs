

using Microsoft.EntityFrameworkCore;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.SeedData
{
    public class RoleSeed
    {
        public static async Task SeedRoleAsync(MyTownDbContext context)
        {
            if (await context.Roles.AnyAsync())
                return;

            var roles = new List<Role>
            {
                new Role { Name = "Admin", Description = "Administrator role" },
                new Role { Name = "Staff", Description = "Staff role" },
                new Role { Name = "Citizen", Description = "Citizen role" }
            };

            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
            }
        }
    
}
