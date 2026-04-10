

using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class IssueRepository : IIssueRepository
    {
        private readonly MyTownDbContext _context;

        public IssueRepository(MyTownDbContext context)
        {
            _context = context;
        }


        public async Task AddIssueAsync(Issue issue)
        {
            await _context.AddAsync(issue);
        }
    }
}
