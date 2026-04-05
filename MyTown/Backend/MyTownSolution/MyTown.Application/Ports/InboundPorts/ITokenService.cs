using MyTown.Application.DTOs.Authentication;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface ITokenService
    {
        string GenerateAccessToken(TokenUserDto user);

        RefreshTokenDto GenerateRefreshToken();

        
    }
}
