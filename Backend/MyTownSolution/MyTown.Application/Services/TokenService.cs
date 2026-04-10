using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MyTown.Application.Authorization;
using MyTown.Application.DTOs.Authentication;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices.JavaScript;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MyTown.Application.Services
{
    public class TokenService : ITokenService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly string _refreshTokenSecretKey;

        public TokenService(IOptions<JwtSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
            _refreshTokenSecretKey = Environment.GetEnvironmentVariable("REFRESH_TOKEN_SECRET_KEY") ?? "Nuk u gjet Refresh Token Sekreti";
        }

        public string HashRefreshToken(string refreshToken)
        {
            var keyBytes = Encoding.UTF8.GetBytes(_refreshTokenSecretKey);
            var tokenBytes = Encoding.UTF8.GetBytes(refreshToken);

            using var hmac = new HMACSHA256(keyBytes);
            var hash = hmac.ComputeHash(tokenBytes);
            return Convert.ToBase64String(hash);
        }

        public string GenerateAccessToken(TokenUserDto user)
        {
            var claims = new List<Claim>
            {
              new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
              new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
              new Claim(JwtRegisteredClaimNames.Email, user.Email),

            };

            if (user.CitizenId.HasValue)
            {
                claims.Add(new Claim("CitizenId", user.CitizenId.Value.ToString()));
            }

            foreach (var role in user.Roles.Distinct())
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            foreach (var premission in user.Permissions.Distinct())
            {
                claims.Add(new Claim(CustomClaimTypes.Permission, premission));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                    issuer: _jwtSettings.Issuer,
                    audience: _jwtSettings.Audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
                    signingCredentials: creds
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public RefreshTokenDto GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);

            return new RefreshTokenDto
            {
                Token = Convert.ToBase64String(randomBytes),
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
            };
        }



    }


}