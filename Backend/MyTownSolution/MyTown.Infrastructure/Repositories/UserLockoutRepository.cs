using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class UserLockoutRepository : IUserLockoutRepository
    {
        private readonly MyTownDbContext _context;

        public UserLockoutRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task<UserLockout?> GetByUserIdAsync(int userId)
        {
            return await _context.UserLockouts.FirstOrDefaultAsync(ul => ul.UserId == userId);
        }

        public async Task AddAsync(UserLockout userLockout)
        {
            await _context.UserLockouts.AddAsync(userLockout);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(UserLockout userLockout)
        {
            userLockout.UpdatedAt = DateTime.UtcNow;
            _context.UserLockouts.Update(userLockout);
            await _context.SaveChangesAsync();
        }
    }
}
