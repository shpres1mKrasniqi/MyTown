using Microsoft.EntityFrameworkCore;
using MyTown.Application;
using MyTown.Domain;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure
{

    public class ConstructionPermitRequestRepository : IConstructionPermitRequestRepository
    {
        private readonly MyTownDbContext _context;

        public ConstructionPermitRequestRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task AddConstructionPermitRequestAsync(ConstructionPermitRequest constructionPermitRequest)
        {
            await _context.ConstructionPermitRequests.AddAsync(constructionPermitRequest);
        }

        public async Task<ConstructionPermitRequest?> GetConstructionPermitRequestById(int id)
        {
            return await _context.ConstructionPermitRequests
                .AsNoTracking()
                .Include(cR => cR.Citizen)
                .Include(cR => cR.ConstructionDocuments)
                .Where(cR => cR.IsDeleted == false)
                .FirstOrDefaultAsync(cR => cR.Id == id);
        }

        public async Task<IEnumerable<ConstructionPermitRequest>> GetAllConstructionPermitRequests()
        {
            return await _context.ConstructionPermitRequests
                .AsNoTracking()
                .Include(cR => cR.Citizen)
                .Include(cR => cR.ConstructionDocuments)
                .Where(cR => cR.IsDeleted == false)
                .ToListAsync();
        }

        public Task UpdateAsync(ConstructionPermitRequest constructionPermitRequest)
        {
            _context.ConstructionPermitRequests.Update(constructionPermitRequest);
            return Task.CompletedTask;
        }

        public Task SoftDeleteAsync(ConstructionPermitRequest constructionPermitRequest)
        {
            _context.ConstructionPermitRequests.Update(constructionPermitRequest);
            return Task.CompletedTask;
        }
    }
}