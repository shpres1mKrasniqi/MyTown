using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class KomunaRepository : IKomunaRepository
    {
        private readonly MyTownDbContext _context;

        public KomunaRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Komuna komuna)
        {
            await _context.Komunas.AddAsync(komuna);
        }

        public async Task<IEnumerable<Komuna>> GetAllActiveAsync()
        {
            return await _context.Komunas
                .AsNoTracking()
                .Where(k => !k.IsDeleted && k.IsActive)
                .OrderBy(k => k.Name)
                .ToListAsync();
        }

        public async Task<Komuna?> GetActiveByIdAsync(int id)
        {
            return await _context.Komunas
                .FirstOrDefaultAsync(k => k.Id == id && !k.IsDeleted && k.IsActive);
        }

        public async Task<bool> ExistsByNameAsync(string name, int? excludeId)
        {
            var query = _context.Komunas.Where(k => !k.IsDeleted && k.IsActive && k.Name == name);
            if (excludeId.HasValue)
            {
                query = query.Where(k => k.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<bool> HasActiveDepartmentsAsync(int komunaId)
        {
            return await _context.Departments
                .AnyAsync(d => d.KomunaId == komunaId && d.IsActive);
        }

        public Task UpdateAsync(Komuna komuna)
        {
            _context.Komunas.Update(komuna);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
