using Microsoft.EntityFrameworkCore;
using MyTown.Application.Authorization;
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
    // Departmente
    new Permission { Name = Permissions.CanCreateDepartment, Description = "Lejon shtimin e departamenteve" },
    new Permission { Name = Permissions.CanViewDepartments, Description = "Lejon shikimin e listës së departamenteve" },
    new Permission { Name = Permissions.CanUpdateDepartment, Description = "Lejon editimin e departamenteve" },
    new Permission { Name = Permissions.CanDeleteDepartment, Description = "Lejon fshirjen e departamenteve" },

    // Komuna
    new Permission { Name = Permissions.CanCreateKomuna, Description = "Lejon krijimin e komunave" },
    new Permission { Name = Permissions.CanViewKomuna, Description = "Lejon shikimin e komunave" },
    new Permission { Name = Permissions.CanUpdateKomuna, Description = "Lejon perditesimin e komunave" },
    new Permission { Name = Permissions.CanDeleteKomuna, Description = "Lejon fshirjen e komunave" },

    // Staff
    new Permission { Name = Permissions.CanCreateStaff, Description = "Lejon krijimin e staff" },
    new Permission { Name = Permissions.CanViewStaff, Description = "Lejon shikimin e staff" },
    new Permission { Name = Permissions.CanUpdateStaff, Description = "Lejon updaten e staff" },
    new Permission { Name = Permissions.CanDeleteStaff, Description = "Lejon fshirjen e staff" },

    // Citizens
    new Permission { Name = Permissions.CanCreateCitizen, Description = "Lejon krijimin e qytetareve" },
    new Permission { Name = Permissions.CanViewCitizen, Description = "Lejon shikimin e qytetareve" },
    new Permission { Name = Permissions.CanUpdateCitizen, Description = "Lejon updaten e qytetareve" },
    new Permission { Name = Permissions.CanDeleteCitizen, Description = "Lejon fshirjen e qytetareve" },
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
