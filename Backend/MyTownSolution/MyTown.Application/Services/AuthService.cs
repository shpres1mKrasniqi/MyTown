using Microsoft.Extensions.Options;
using MyTown.Application.DTOs.Authentication;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Application.Settings;
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
        private readonly IStaffRepository _staffRepository;
        private readonly IPasswordResetTokenRepository _passwordResetTokenRepository;
        private readonly IEmailService _emailService;
        private readonly EmailSettings _emailSettings;
        private readonly string _resetCodeSecretKey;
        private readonly ISettingRepository _settingRepository;
        private readonly IUserLockoutRepository _userLockoutRepository;

        public AuthService(
            IUserRepository userRepository,
            IRoleRepository roleRepository,
            ITokenService tokenService,
            IRefreshTokenRepository refreshTokenRepository,
            ICitizenRepository citizenRepository,
             IStaffRepository staffRepository,
            IPasswordResetTokenRepository passwordResetTokenRepository,
            IEmailService emailService,
            IOptions<EmailSettings> emailSettings,
            ISettingRepository settingRepository,
            IUserLockoutRepository userLockoutRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _tokenService = tokenService;
            _refreshTokenRepository = refreshTokenRepository;
            _citizenRepository = citizenRepository;
            _staffRepository = staffRepository;
            _passwordResetTokenRepository = passwordResetTokenRepository;
            _emailService = emailService;
            _emailSettings = emailSettings.Value;
            _settingRepository = settingRepository;
            _userLockoutRepository = userLockoutRepository;

            _resetCodeSecretKey =
                Environment.GetEnvironmentVariable("RESET_CODE_SECRET_KEY")
                ?? throw new Exception("RESET_CODE_SECRET_KEY nuk u gjet në .env");
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
            if (user == null || !user.IsActive)
            {
                throw new Exception("Kredenciale te pavlefshme");
            }

            var lockout = await _userLockoutRepository.GetByUserIdAsync(user.Id);
            if (lockout != null && lockout.LockoutEnd.HasValue && lockout.LockoutEnd.Value > DateTime.UtcNow)
            {
                var remainingMinutes = (int)(lockout.LockoutEnd.Value - DateTime.UtcNow).TotalMinutes + 1;
                throw new Exception($"Llogaria juaj është bllokuar përkohësisht. Provoni përsëri pas {remainingMinutes} minutash.");
            }

            var isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isValid)
            {
                var maxAttemptsSetting = await _settingRepository.GetByKeyAsync("LOGIN_MAX_FAILED_ATTEMPTS");
                var lockoutMinutesSetting = await _settingRepository.GetByKeyAsync("LOGIN_LOCKOUT_MINUTES");
                
                int maxAttempts = maxAttemptsSetting != null ? int.Parse(maxAttemptsSetting.Value) : 5;
                int lockoutMinutes = lockoutMinutesSetting != null ? int.Parse(lockoutMinutesSetting.Value) : 10;

                if (lockout == null)
                {
                    lockout = new UserLockout
                    {
                        UserId = user.Id,
                        FailedAttempts = 1,
                        LastFailedAttemptAt = DateTime.UtcNow
                    };
                    await _userLockoutRepository.AddAsync(lockout);
                }
                else
                {
                    lockout.FailedAttempts += 1;
                    lockout.LastFailedAttemptAt = DateTime.UtcNow;

                    if (lockout.FailedAttempts >= maxAttempts)
                    {
                        lockout.LockoutEnd = DateTime.UtcNow.AddMinutes(lockoutMinutes);
                    }
                    await _userLockoutRepository.UpdateAsync(lockout);
                }

                if (lockout.FailedAttempts >= maxAttempts)
                {
                    throw new Exception($"Llogaria juaj është bllokuar përkohësisht. Provoni përsëri pas {lockoutMinutes} minutash.");
                }

                throw new Exception("Kredenciale te pavlefshme");
            }

            if (lockout != null && lockout.FailedAttempts > 0)
            {
                lockout.FailedAttempts = 0;
                lockout.LockoutEnd = null;
                await _userLockoutRepository.UpdateAsync(lockout);
            }
            
            var citizen = await _citizenRepository.GetByUserIdAsync(user.Id);
            var staff = await _staffRepository.GetByUserIdAsync(user.Id);

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
                StaffId = staff?.Id,
                KomunaId = citizen?.KomunaId,
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
            var staff = await _staffRepository.GetByUserIdAsync(user.Id);

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
                StaffId = staff?.Id,
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
        public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null || !user.IsActive)
                return;

            await _passwordResetTokenRepository.InvalidateAllForUserAsync(user.Id);

            var code = GenerateNumericCode();
            var codeHash = HashResetCode(code);

            var resetToken = new PasswordResetToken(
                user.Id,
                codeHash,
                DateTime.UtcNow.AddMinutes(_emailSettings.ResetCodeExpirationMinutes)
            );

            await _passwordResetTokenRepository.AddAsync(resetToken);
            await _emailService.SendPasswordResetCodeAsync(user.Email, user.FirstName, code);
        }

        public async Task ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null || !user.IsActive)
                throw new Exception("Kërkesa është e pavlefshme.");

            var codeHash = HashResetCode(request.Code);
            var resetToken = await _passwordResetTokenRepository.GetActiveByUserIdAsync(user.Id);

            if (resetToken == null || !resetToken.CanBeUsed(codeHash))
                throw new Exception("Kodi nuk është i vlefshëm ose ka skaduar.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateUserAsync(user);

            resetToken.MarkAsUsed();
            await _passwordResetTokenRepository.UpdateAsync(resetToken);

            await _passwordResetTokenRepository.InvalidateAllForUserAsync(user.Id);
            await RevokeAllTokensAsync(user.Id);
        }

        private static string GenerateNumericCode()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            var value = BitConverter.ToUInt32(bytes, 0) % 1_000_000;
            return value.ToString("D6");
        }

        private string HashResetCode(string code)
        {
            var keyBytes = Encoding.UTF8.GetBytes(_resetCodeSecretKey);
            var codeBytes = Encoding.UTF8.GetBytes(code);

            using var hmac = new HMACSHA256(keyBytes);
            return Convert.ToBase64String(hmac.ComputeHash(codeBytes));
        }

    }

}
