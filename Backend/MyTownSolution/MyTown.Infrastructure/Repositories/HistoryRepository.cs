using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class HistoryRepository : IHistoryRepository
    {
        private readonly MyTownDbContext _context;

        public HistoryRepository(MyTownDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Event>> GetEventsAsync()
        {
            return await _context.Events
                .Where(x => !x.IsDeleted)
                .ToListAsync();
        }
        public async Task<IEnumerable<ProjectProposal>> GetProjectsAsync()
        {
            return await _context.ProjectProposals
                .Where(x => !x.IsDeleted)
                .ToListAsync();
        }
        public async Task<IEnumerable<MeetingRequest>> GetMeetingsAsync()
        {
            return await _context.MeetingRequests
                .Where(x => !x.IsDeleted)
                .ToListAsync();
        }
        public async Task<IEnumerable<ConstructionPermitRequest>> GetConstructionPermitsAsync()
        {
            return await _context.ConstructionPermitRequests
                .Where(x => !x.IsDeleted)
                .ToListAsync();
        }
    }
}
