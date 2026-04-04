using Microsoft.EntityFrameworkCore;
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
            await _context.CitizenProfiles.AddAsync(citizenProfile);
        }

        public async Task<IEnumerable<CitizenProfile>> GetAllCitizensAsync()
        {
            return await _context.CitizenProfiles
                .Include(c => c.User)
                .Where(c => !c.IsDeleted)
                .ToListAsync();
        }

        public async Task<CitizenProfile> GetCitizenByIdAsync(int id)
        {
            return await _context.CitizenProfiles
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
        }

        public async Task UpdateCitizenAsync(CitizenProfile citizenProfile)
        {
            _context.CitizenProfiles.Update(citizenProfile);
        }
    }
}