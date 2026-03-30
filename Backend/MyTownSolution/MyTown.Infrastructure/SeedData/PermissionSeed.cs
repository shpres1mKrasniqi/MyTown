using Microsoft.EntityFrameworkCore;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.SeedData
{
    public class PermissionSeed
    {
        public static async Task SeedPermissionsAsync(MyTownDbContext context)
        {
            
            var permissions = new List<Permission>
            {
                //Departmente
                new Permission { Name = "CanCreateDepartment", Description = "Lejon shtimin e departamenteve" },
                new Permission { Name = "CanViewDepartments", Description = "Lejon shikimin e listës së departamenteve" },
                new Permission { Name = "CanUpdateDepartment", Description = "Lejon editimin e departamenteve" },
                new Permission { Name = "CanDeleteDepartment", Description = "Lejon fshirjen e departamenteve" },
                // Komuna
                new Permission { Name = "CanCreateKomuna", Description = "Lejon krijimin e komunave" },
                new Permission { Name = "CanViewKomunas", Description = "Lejon shikimin e komunave" },
                new Permission { Name = "CanUpdateKomuna", Description = "Lejon perditesimin e komunave" },
                new Permission { Name = "CanDeleteKomuna", Description = "Lejon fshirjen e komunave" }
            };

            foreach (var p in permissions)
            {
                if (!await context.Permissions.AnyAsync(x => x.Name == p.Name))
                {
                    await context.Permissions.AddAsync(p);
                }
            }
            await context.SaveChangesAsync();

            
            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
            if (adminRole != null)
            {
                var allPerms = await context.Permissions.ToListAsync();
                foreach (var perm in allPerms)
                {
                    var exists = await context.RolePermissions
                        .AnyAsync(rp => rp.RoleId == adminRole.Id && rp.PermissionId == perm.Id);

                    if (!exists)
                    {
                        await context.RolePermissions.AddAsync(new RolePermission
                        {
                            RoleId = adminRole.Id,
                            PermissionId = perm.Id
                        });
                    }
                }
                await context.SaveChangesAsync();
            }
        }
    }
}