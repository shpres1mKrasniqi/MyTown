using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
namespace MyTown.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly MyTownDbContext _context;

        public NotificationRepository(MyTownDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(Notifications notifications)
        {
            await _context.Notifications.AddAsync(notifications);
        }
        public async Task<List<Notifications>> GetByUserIdAsync(int userId)
        {
            return await _context.Notifications.Where(n => n.UserId == userId).ToListAsync();
        }
        public async Task<Notifications?> GetByIdAsync(int id)
        {
            return await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id);
        }
    }
}
