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
        public async Task UpdateAsync(CitizenProfile citizenProfile)
        {
            _context.CitizenProfiles.Update(citizenProfile);
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
