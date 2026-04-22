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
        public async Task<IEnumerable<StaffProfile>> GetAllAsync()
        {
            return await _context.StaffProfiles
                .Include(s=> s.User)
                .Include(s=>s.Department)
                .Where(s => s.IsDeleted == false).ToListAsync();
        }
        public async Task<StaffProfile> GetByIdAsync(int id)
        {
            return await _context.StaffProfiles
                .Include(s=>s.User)
                .Include(s=>s.Department)
                .FirstOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);
        }
        public async Task<List<StaffProfile>>GetByKomunaIdAsync(int komunaId)
        {
            return await _context.StaffProfiles
                .Include(s => s.User)
                .Include(s =>s.Department)
                .Where(s => s.IsDeleted == false && s.DepartmentId == komunaId)
                .ToListAsync();
        }
        public async Task UpdateAsync(StaffProfile staffProfile)
        {
            _context.StaffProfiles.Update(staffProfile);
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}