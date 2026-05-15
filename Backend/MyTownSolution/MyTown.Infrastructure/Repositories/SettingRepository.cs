using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class SettingRepository : ISettingRepository
    {
        private readonly MyTownDbContext _context;

        public SettingRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task<Setting?> GetByKeyAsync(string key)
        {
            return await _context.Settings.FirstOrDefaultAsync(s => s.Key == key);
        }

        public async Task UpdateAsync(Setting setting)
        {
            setting.UpdatedAt = DateTime.UtcNow;
            _context.Settings.Update(setting);
            await _context.SaveChangesAsync();
        }
    }
}
