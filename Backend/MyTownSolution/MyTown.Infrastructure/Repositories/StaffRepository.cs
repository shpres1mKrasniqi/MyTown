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
    }
}