

using Microsoft.EntityFrameworkCore;
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

        public async Task<IEnumerable<Issue>> GetAllAsync()
        {
            return await _context.Issues
                .Include(i => i.Files)
                .Include(i => i.IssueCategory)
                .Include(i => i.Komuna)
                .Include(i => i.Citizen).ThenInclude(c => c.User)
                .Where(i => i.IsDeleted == false)
                .ToListAsync();
        }

        public async Task<Issue?> GetIssueByIdAsync(int id)
        {
            return await _context.Issues
                .Include(i => i.Files)
                .Include(i => i.IssueCategory)
                .Include(i => i.Komuna)
                .Include(i => i.Citizen).ThenInclude(c => c.User)
                .FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);
        }

        public async Task Update(Issue issue)
        {
            _context.Issues.Update(issue);
        }

        public IQueryable<Issue> Query()
        {
            return _context.Issues
                .Include(i => i.Files)
                .Include(i => i.IssueCategory)
                .Include(i => i.Komuna)
                .Include(i => i.Citizen).ThenInclude(c => c.User)
                .Where(i => i.IsDeleted == false)
                .AsQueryable();
        }

    }
}
