using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class CitizenRepository : ICitizenRepository
    {
        private readonly MyTownDbContext _context;

        public CitizenRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task AddCitizenAsync(CitizenProfile citizenProfile)
        {
            _context.CitizenProfiles.Add(citizenProfile);
        }
        public async Task<IEnumerable<CitizenProfile>> GetAll()
        {
            return await _context.CitizenProfiles.Where(c => c.IsDeleted == false ).ToListAsync();
        }
        public async Task<CitizenProfile> GetById(int id)
        {
            return await _context.CitizenProfiles.FirstOrDefaultAsync(c => c.Id == id && c.IsDeleted == false);
        }
        public async Task<List<CitizenProfile>> GetByKomunaIdAsync(int komunaId)
        {
            return await _context.CitizenProfiles
                .Include(s => s.User)
                .Include(s => s.Komuna)
                .Where(s => s.IsDeleted == false && s.KomunaId == komunaId)
                .ToListAsync();
        }
        public async Task UpdateAsync(CitizenProfile citizenProfile)
        {
            _context.CitizenProfiles.Update(citizenProfile);
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<CitizenProfile?> GetByUserIdAsync(int userId)
        {
            return await _context.CitizenProfiles
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsDeleted);
        }

        public async Task<bool> ExistsByPersonalNumberAsync(string personalNumber)
        {
            return await _context.CitizenProfiles
                .AnyAsync(c => c.PersonalNumber == personalNumber && !c.IsDeleted);
        }

        public IQueryable<CitizenProfile> Query()
        {
            return _context.CitizenProfiles
                .AsNoTracking()
                .Include(c => c.User)
                .Include(c => c.Komuna)
                .Where(c => c.IsDeleted == false)
                .AsQueryable();
        }
    }
}
