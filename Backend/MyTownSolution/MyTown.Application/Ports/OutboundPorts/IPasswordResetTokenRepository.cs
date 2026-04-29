using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IPasswordResetTokenRepository
    {
        Task AddAsync(PasswordResetToken token);
        Task<PasswordResetToken?> GetActiveByUserIdAsync(int userId);
        Task UpdateAsync(PasswordResetToken token);
        Task InvalidateAllForUserAsync(int userId);
    }
}