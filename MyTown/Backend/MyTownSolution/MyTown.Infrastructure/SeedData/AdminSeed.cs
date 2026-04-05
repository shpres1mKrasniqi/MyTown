using Microsoft.EntityFrameworkCore;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.SeedData
{
    public class AdminSeed
    {
        public static async Task SeedAdminAsync(MyTownDbContext context)
        {
        
            var existingAdmin = await context.Users
                .FirstOrDefaultAsync(u => u.Email == "admin@myTown.com");

            if (existingAdmin != null)
                return;

     
            var adminRole = await context.Roles
                .FirstOrDefaultAsync(r => r.Name == "Admin");

            if (adminRole == null)
                throw new Exception("Admin role nuk ekziston!");


            var adminPassword = Environment.GetEnvironmentVariable("DEFAULT_ADMIN_PASSWORD")
                     ?? "DefaultLocalPassword123!";
            var admin = new User
            {
                FirstName = "Administrator",
                LastName = "Krasniqi",
                Email = "admin@myTown.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword)
            };
            await context.Users.AddAsync(admin);
            await context.SaveChangesAsync(); 

           
            var userRole = new UserRole
            {
                UserId = admin.Id,
                RoleId = adminRole.Id
            };

            await context.UserRoles.AddAsync(userRole);
            await context.SaveChangesAsync();
        }
    }
}