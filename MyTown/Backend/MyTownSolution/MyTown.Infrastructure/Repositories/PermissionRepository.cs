using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Persistence.Repositories
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly MyTownDbContext _context;

        public PermissionRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task<bool> RoleHasPermissionAsync(string roleName, string permissionName)
        {
            return await _context.RolePermissions
                .AnyAsync(rp => rp.Role.Name == roleName &&
                               rp.Permission.Name == permissionName);
        }
    }
}