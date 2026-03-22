

using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IRefreshTokenRepository
    {
        Task AddAsync(RefreshToken refreshToken);

        Task UpdateAsync(RefreshToken refreshToken);

        Task<RefreshToken?> GetByTokenHashAsync(string tokenHash);

        Task<List<RefreshToken>> GetUserTokensAsync(int userId);
    }
}
