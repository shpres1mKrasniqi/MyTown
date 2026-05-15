using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IUserLockoutRepository
    {
        Task<UserLockout?> GetByUserIdAsync(int userId);
        Task AddAsync(UserLockout userLockout);
        Task UpdateAsync(UserLockout userLockout);
    }
}
