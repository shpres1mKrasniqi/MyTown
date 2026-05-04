using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Domain.Enums;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly MyTownDbContext _context;

        public EventRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Event ev ) => await _context.Events.AddAsync(ev);

        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            return await _context.Events
                .Include(e => e.Komuna)
                .Include(e => e.Files)
                .Include(e => e.StaffProfile)
                   .ThenInclude(s => s.User)
                .Where(e => !e.IsDeleted)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }
        public async Task<Event> GetByIdAsync(int id)
        {
            return await _context.Events
                .Include(e => e.Komuna)
                .Include(e => e.Files)
                .Include(e => e.StaffProfile)
                .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);
        }

        public async Task UpdateAsync(Event ev) => _context.Events.Update(ev);

       


    }
}
