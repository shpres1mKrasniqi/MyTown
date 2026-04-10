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
        private readonly ICitizenRepository _citizenRepository;
        public AuthService(
                 IUserRepository userRepository,
                 IRoleRepository roleRepository,
                 ITokenService tokenService,
                 IRefreshTokenRepository refreshTokenRepository,
                 ICitizenRepository citizenRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _tokenService = tokenService;
            _refreshTokenRepository = refreshTokenRepository;
            _citizenRepository = citizenRepository;

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
                Roles = new List<string> { role.Name },
                Permissions = new List<string>()
            };

            var accessToken = _tokenService.GenerateAccessToken(tokenUser);
            var refreshTokenDto = _tokenService.GenerateRefreshToken();

            var tokenHash = _tokenService.HashRefreshToken(refreshTokenDto.Token);


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
            var citizen = await _citizenRepository.GetByUserIdAsync(user.Id);

            var roles = user.UserRoles.Select(ur => ur.Role.Name).Distinct().ToList();

            var permissions = user.UserRoles
             .SelectMany(ur => ur.Role.RolePermissions)
               .Select(rp => rp.Permission.Name)
               .Distinct()
               .ToList();

            var tokenUser = new TokenUserDto
            {
                Id = user.Id,
                CitizenId = citizen?.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Roles = roles,
                Permissions = permissions
            };

            var accessToken = _tokenService.GenerateAccessToken(tokenUser);
            var refreshTokenDto = _tokenService.GenerateRefreshToken();

            var tokenHash = _tokenService.HashRefreshToken(refreshTokenDto.Token);

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

            var tokenHash = _tokenService.HashRefreshToken(refreshToken);


            var existingToken = await _refreshTokenRepository.GetByTokenHashAsync(tokenHash);

            if (existingToken == null || !existingToken.IsActive)
                throw new Exception("Invalid or expired refresh token");


            var user = existingToken.User;

            var citizenProfile = await _citizenRepository.GetByUserIdAsync(user.Id);

            var roles = user.UserRoles.Select(ur => ur.Role.Name).Distinct().ToList();

            var permissions = user.UserRoles
             .SelectMany(ur => ur.Role.RolePermissions)
               .Select(rp => rp.Permission.Name)
               .Distinct()
               .ToList();


            var tokenUser = new TokenUserDto
            {
                Id = user.Id,
                CitizenId = citizenProfile?.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Roles = roles,
                Permissions = permissions
            };


            var newAccessToken = _tokenService.GenerateAccessToken(tokenUser);
            var newRefreshTokenDto = _tokenService.GenerateRefreshToken();


            existingToken.RevokedAt = DateTime.UtcNow;
            await _refreshTokenRepository.UpdateAsync(existingToken);


            var newTokenHash = _tokenService.HashRefreshToken(newRefreshTokenDto.Token);


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
