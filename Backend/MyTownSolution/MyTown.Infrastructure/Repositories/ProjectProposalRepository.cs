

using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class ProjectProposalRepository : IProjectProposalRepository
    {
        private readonly MyTownDbContext _context;

        public ProjectProposalRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task AddProjectProposalAsync(ProjectProposal projectProposal)
        {
            await _context.ProjectProposals.AddAsync(projectProposal);
                
        }

        public async Task<IEnumerable<ProjectProposal>> GetAllProposalsAsync()
        {
            return await _context.ProjectProposals
                .AsNoTracking()
                .Include(pp => pp.Komuna)
                .Where(pp => !pp.IsDeleted)
                .OrderByDescending(pp => pp.CreatedAt)
                .ToListAsync();
        }

        public async Task<ProjectProposal?> GetProjectProposalsByIdAsync(int proposalId)
        {
            return await _context.ProjectProposals
                .AsNoTracking()
                .Include(pp => pp.Komuna)
                .FirstOrDefaultAsync(pp => pp.Id == proposalId && !pp.IsDeleted);
        }
    }
}
