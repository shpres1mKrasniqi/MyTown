using MyTown.Application.DTOs.StaffProfiles;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Domain.Entities;
//Qoja chatit bane copy qeta 4 

namespace MyTown.Application.Services
{
    public class StaffService : IStaffServices
    {
        private readonly IStaffRepository _staffRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepo;
        private readonly IAuditRepository _auditRepository;

        public StaffService(IStaffRepository staffRepository, IUnitOfWork unitOfWork, IUserRepository userRepo, IAuditRepository auditRepository)
        {
            _staffRepository = staffRepository;
            _unitOfWork = unitOfWork;
            _userRepo = userRepo;
            _auditRepository = auditRepository;
        }

        public async Task<StaffResponseDto> AddStaffProfilesAsync(CreateStaffDto dto, int adminId, string ipAddress)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));


            var exists = await _userRepo.ExistsByEmailAsync(dto.Email);
            if (exists)
                throw new Exception("Email tashme ekziston!");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);


            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = hashedPassword
            };

            await _userRepo.CreateUserAsync(user);

            await _unitOfWork.SaveChangesAsync();


            await _userRepo.AssignRoleAsync(user, 2);

            await _unitOfWork.SaveChangesAsync();


            var staff = new StaffProfile(
                user,
                dto.Position,
                dto.DateHired,
                dto.DepartmentId
            );

            await _staffRepository.AddStaffAsync(staff);

            await _unitOfWork.SaveChangesAsync();


            var log = new AuditLog(
                adminId,
                "CREATE",
                "StaffProfile",
                staff.Id,
                null,
                $"Staff u kriju: {user.Email}",
                ipAddress
            );

            await _auditRepository.AddAsync(log);

            await _unitOfWork.SaveChangesAsync();

            var response = new StaffResponseDto
            {

                FirstName = user.FirstName,
                LastName = user.LastName,

                Position = staff.Position,
                DateHired = staff.DateHired,

            };

            return response;
        }

       
    }
}