

using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class IssueCategoryRepository : IIssueCategoryRepository
    {
        private readonly MyTownDbContext _context;

        public IssueCategoryRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task AddIssueCategory(IssueCategory issueCategory)
        {
           await  _context.IssueCategories.AddAsync(issueCategory);

        }

        public async Task<IEnumerable<IssueCategory>> GetAllIssueCategoriesAsync()
        {
            return await _context.IssueCategories.Where(ic => ic.IsDeleted == false).ToListAsync();  
        }

        public async Task<IssueCategory?> GetIssueCategoryByIdAsync(int id)
        {
            return await _context.IssueCategories
                .FirstOrDefaultAsync(ic => ic.Id == id && !ic.IsDeleted);
        }

        public async Task Update(IssueCategory issueCategory)
        {
            _context.IssueCategories.Update(issueCategory);
        }

        public async Task Delete(IssueCategory issueCategory)
        {
            _context.IssueCategories.Update(issueCategory);
        }
    }
}
