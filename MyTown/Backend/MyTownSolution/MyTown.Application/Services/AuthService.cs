using MyTown.Application.DTOs.Authentication;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using System.Data;
using System.Security.Cryptography;
using System.Text;

namespace MyTown.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly ITokenService _tokenService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public AuthService(
                 IUserRepository userRepository,
                 IRoleRepository roleRepository,
                 ITokenService tokenService,
                 IRefreshTokenRepository refreshTokenRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _tokenService = tokenService;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            if (await _userRepository.ExistsByEmailAsync(request.Email))
            {
                throw new Exception("Email tashme ekziston!");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = passwordHash
            };

            await _userRepository.CreateUserAsync(user);

            var role = await _roleRepository.GetRoleByNameAsync("Citizen");
            if (role == null)
            {
                throw new Exception("Roli nuk u gjet!");
            }

            await _userRepository.AssignRoleAsync(user, role.Id);

            var tokenUser = new TokenUserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                RoleName = role.Name
            };

            var accessToken = _tokenService.GenerateAccessToken(tokenUser);
            var refreshTokenDto = _tokenService.GenerateRefreshToken();

            var tokenHash = Convert.ToBase64String(
                      SHA256.HashData(Encoding.UTF8.GetBytes(refreshTokenDto.Token))
                );

            var refreshToken = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                ExpiresAt = refreshTokenDto.ExpiresAt
            };

            await _refreshTokenRepository.AddAsync(refreshToken);

            return new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Roles = new List<string> { role.Name },
                AccessToken = accessToken,
                RefreshToken = refreshTokenDto.Token,
                ExpiresAt = refreshTokenDto.ExpiresAt
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                throw new Exception("Kredenciale te pavlefshme");
            }

            var isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isValid)
            {
                throw new Exception("Kredenciale te pavlefshme");
            }

            var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();

            var permissions = user.UserRoles
             .SelectMany(ur => ur.Role.RolePermissions)
               .Select(rp => rp.Permission.Name)
               .Distinct()
               .ToList();

            var tokenUser = new TokenUserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                RoleName = roles.FirstOrDefault() ?? "Citizen",
                Permissions = permissions
            };

            var accessToken = _tokenService.GenerateAccessToken(tokenUser);
            var refreshTokenDto = _tokenService.GenerateRefreshToken();

            var tokenHash = Convert.ToBase64String(
                     SHA256.HashData(Encoding.UTF8.GetBytes(refreshTokenDto.Token))
                );

            var refreshToken = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                ExpiresAt = refreshTokenDto.ExpiresAt
            };

            await _refreshTokenRepository.AddAsync(refreshToken);

            return new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Roles = roles,
                AccessToken = accessToken,
                RefreshToken = refreshTokenDto.Token,
                ExpiresAt = refreshTokenDto.ExpiresAt
            };
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {

            var tokenHash = Convert.ToBase64String(
                SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken))
            );


            var existingToken = await _refreshTokenRepository.GetByTokenHashAsync(tokenHash);

            if (existingToken == null || !existingToken.IsActive)
                throw new Exception("Invalid or expired refresh token");


            var user = existingToken.User;


            var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();


            var tokenUser = new TokenUserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                RoleName = roles.First()
            };


            var newAccessToken = _tokenService.GenerateAccessToken(tokenUser);
            var newRefreshTokenDto = _tokenService.GenerateRefreshToken();


            existingToken.RevokedAt = DateTime.UtcNow;
            await _refreshTokenRepository.UpdateAsync(existingToken);


            var newTokenHash = Convert.ToBase64String(
                SHA256.HashData(Encoding.UTF8.GetBytes(newRefreshTokenDto.Token))
            );


            var newRefreshToken = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = newTokenHash,
                ExpiresAt = newRefreshTokenDto.ExpiresAt
            };

            await _refreshTokenRepository.AddAsync(newRefreshToken);


            return new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Roles = roles,
                AccessToken = newAccessToken,
                RefreshToken = newRefreshTokenDto.Token,
                ExpiresAt = newRefreshTokenDto.ExpiresAt
            };
        }

        public async Task RevokeAllTokensAsync(int userId)
        {
            var tokens = await _refreshTokenRepository.GetUserTokensAsync(userId);

            foreach (var token in tokens.Where(t => t.IsActive))
            {
                token.RevokedAt = DateTime.UtcNow;
                await _refreshTokenRepository.UpdateAsync(token);
            }
        }

    }
}