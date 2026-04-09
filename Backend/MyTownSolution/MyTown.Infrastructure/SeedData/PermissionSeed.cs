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
     // Departamente
     new Permission { Name = Permissions.CanCreateDepartment, Description = "Lejon shtimin e departamenteve" },
     new Permission { Name = Permissions.CanViewDepartments, Description = "Lejon shikimin e listës së departamenteve" },
     new Permission { Name = Permissions.CanUpdateDepartment, Description = "Lejon editimin e departamenteve" },
     new Permission { Name = Permissions.CanDeleteDepartment, Description = "Lejon fshirjen e departamenteve" },

     // Komuna
     new Permission { Name = Permissions.CanCreateKomuna, Description = "Lejon krijimin e komunave" },
     new Permission { Name = Permissions.CanViewKomuna, Description = "Lejon shikimin e komunave" },
     new Permission { Name = Permissions.CanEditKomuna, Description = "Lejon editimin e komunave" },
     new Permission { Name = Permissions.CanDeleteKomuna, Description = "Lejon fshirjen e komunave" },

     // Stafi
     new Permission { Name = Permissions.CanCreateStaff, Description = "Lejon krijimin e stafit" },
     new Permission { Name = Permissions.CanViewStaff, Description = "Lejon shikimin e stafit" },
     new Permission { Name = Permissions.CanEditStaff, Description = "Lejon editimin e stafit" },
     new Permission { Name = Permissions.CanDeleteStaff, Description = "Lejon fshirjen e stafit" },

     // Qytetarët
     new Permission { Name = Permissions.CanCreateCitizen, Description = "Lejon krijimin e qytetarëve" },
     new Permission { Name = Permissions.CanViewCitizen, Description = "Lejon shikimin e qytetarëve" },
     new Permission { Name = Permissions.CanEditCitizen, Description = "Lejon editimin e qytetarëve" },
     new Permission { Name = Permissions.CanDeleteCitizen, Description = "Lejon fshirjen e qytetarëve" },

      // Kategorite e problemit
     new Permission { Name = Permissions.CanCreateIssueCategory, Description = "Lejon krijimin e Kategorise se problemit" },
     new Permission { Name = Permissions.CanViewIssueCategory, Description = "Lejon shikimin e  Kategorise se problemit" },
     new Permission { Name = Permissions.CanEditIssueCategory, Description = "Lejon editimin e  Kategorise se problemit" },
     new Permission { Name = Permissions.CanDeleteIssueCategory, Description = "Lejon fshirjen e  Kategorise se problemit" },

     //WorkSchedule

     new Permission { Name = Permissions.CanCreateWorkSchedule, Description = "Lejon krijimin e orareve të punës" },
     new Permission { Name = Permissions.CanEditWorkSchedule, Description = "Lejon editimin e orareve të punës" },
     new Permission { Name = Permissions.CanDeleteWorkSchedule, Description = "Lejon fshirjen e orareve të punës" },
     new Permission { Name = Permissions.CanViewWorkSchedule, Description = "Lejon shikimin e orareve të punës" },

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
            var citizenRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Citizen");

            if (citizenRole != null)
            {
                var permissionsToAdd = new List<string>
    {
                    Permissions.CanViewDepartments,
                    Permissions.CanViewKomuna,
                    Permissions.CanViewStaff,
                    Permissions.CanViewCitizen
    };

                foreach (var permName in permissionsToAdd)
                {
                    var perm = await context.Permissions.FirstOrDefaultAsync(p => p.Name == permName);
                    if (perm != null)
                    {
                        var exists = await context.RolePermissions.AnyAsync(rp =>
                            rp.RoleId == citizenRole.Id && rp.PermissionId == perm.Id);
                        if (!exists)
                        {
                            await context.RolePermissions.AddAsync(new RolePermission
                            {
                                RoleId = citizenRole.Id,
                                PermissionId = perm.Id
                            });
                        }
                    }
                }

                await context.SaveChangesAsync();
        
            }
        }
    }
}
