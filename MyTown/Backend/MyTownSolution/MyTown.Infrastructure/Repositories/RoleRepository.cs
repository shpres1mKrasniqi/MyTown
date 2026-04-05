

using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;


namespace MyTown.Infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly MyTownDbContext _context;

        public RoleRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task<Role?> GetRoleByIdAsync(int roleId)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.Id == roleId);
        }

        public async Task<bool> ExistsAsync(int roleId)
        {
            return await _context.Roles.AnyAsync(r=> r.Id == roleId);
        }

        public async Task<Role?> GetRoleByNameAsync(string roleName)
        {
            return await _context.Roles.FirstOrDefaultAsync(r=>r.Name == roleName);
        }

    }
}
