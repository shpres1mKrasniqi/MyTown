using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class StaffRepository : IStaffRepository
    {

        private readonly MyTownDbContext _context;

        public StaffRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task AddStaffAsync(StaffProfile staffProfile)
        {

            await _context.StaffProfiles.AddAsync(staffProfile);

        }

        public async Task<IEnumerable<StaffProfile>> GetAllStaff()
        {
            return await _context.StaffProfiles

                .Include(s => s.User)
                .Include(s => s.Department) 
                .Where(s => !s.IsDeleted)
                .ToListAsync();
        }

        public async Task<StaffProfile> GetStaffProfileByIdAsync(int id)
        {
            return await _context.StaffProfiles.Include(s => s.User)
                .ThenInclude(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task UpdateStaffProfileAsync(StaffProfile staffProfile)
        {
           
        }
    }
}