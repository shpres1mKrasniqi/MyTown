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
    }
}
