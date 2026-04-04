using MyTown.Application.DTOs.Citizens;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Domain.Entities;
using System.Collections;
using System.Net;

namespace MyTown.Application.Services
{
    public class CitizenService : ICitizenService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICitizenRepository _citizenRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditRepository _auditRepository;
        public CitizenService(IUserRepository userRepository, ICitizenRepository citizenRepository, IUnitOfWork unitOfWork, IAuditRepository auditRepository)
        {
            _userRepository = userRepository;
            _citizenRepository = citizenRepository;
            _unitOfWork = unitOfWork;
            _auditRepository = auditRepository;
        }

        public async Task<CitizenResponseDto> CreateCitizenAsync(CreateCitizenDto createCitizen, int adminId, string ipAddress)
        {
            if (createCitizen == null)
            {
                throw new Exception("Nuk eshte dhene formati valid i te dhenav");
            }
            var exists = await _userRepository.ExistsByEmailAsync(createCitizen.Email);
            if (exists)
                throw new Exception("Email tashme ekziston!");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(createCitizen.Password);

            var user = new User
            {
                FirstName = createCitizen.FirstName,
                LastName = createCitizen.LastName,
                Email = createCitizen.Email,
                PasswordHash = hashedPassword
            };

            await _userRepository.CreateUserAsync(user);
            await _unitOfWork.SaveChangesAsync();

            await _userRepository.AssignRoleAsync(user, 3);

            await _unitOfWork.SaveChangesAsync();

            var citizen = new CitizenProfile
                (
                user,
                createCitizen.KomunaId,
                createCitizen.PhoneNumber,
                createCitizen.Address
                );

            await _citizenRepository.AddCitizenAsync(citizen);
            await _unitOfWork.SaveChangesAsync();

            var log = new AuditLog(
                adminId,
                "CREATE",
                "CitizenProfile",
                citizen.Id,
                null,
                $"Profili i Qytetarit u kriju: {user.Email}",
                ipAddress
            );

            await _auditRepository.AddAsync(log);

            await _unitOfWork.SaveChangesAsync();

            var reponse = new CitizenResponseDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Address = citizen.Address,
                PhoneNumber = citizen.PhoneNumber
            };

            return reponse;



        }

    }
}
