using MyTown.Application.DTOs.Citizens;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Domain.Entities;

namespace MyTown.Application.Services
{
    public class CitizenService : ICitizenService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICitizenRepository _citizenRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditRepository _auditRepository;

        public CitizenService(IUserRepository userRepository, ICitizenRepository citizenRepository,
            IUnitOfWork unitOfWork, IAuditRepository auditRepository)
        {
            _userRepository = userRepository;
            _citizenRepository = citizenRepository;
            _unitOfWork = unitOfWork;
            _auditRepository = auditRepository;
        }

        public async Task<CitizenResponseDto> CreateCitizenAsync(CreateCitizenDto dto, int adminId, string ipAddress)
        {
            if (dto == null) throw new Exception("Nuk eshte dhene formati valid i te dhenave");

            var exists = await _userRepository.ExistsByEmailAsync(dto.Email);
            if (exists) throw new Exception("Email tashme ekziston!");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = hashedPassword
            };

            await _userRepository.CreateUserAsync(user);
            await _unitOfWork.SaveChangesAsync();

            await _userRepository.AssignRoleAsync(user, 3);
            await _unitOfWork.SaveChangesAsync();

            var citizen = new CitizenProfile(user, dto.KomunaId, dto.PhoneNumber, dto.Address);
            citizen.SetCreated(adminId);

            await _citizenRepository.AddCitizenAsync(citizen);
            await _unitOfWork.SaveChangesAsync();

            var log = new AuditLog(adminId, "CREATE", "CitizenProfile", citizen.Id, null, $"Qytetari u krijua: {user.Email}", ipAddress);
            await _auditRepository.AddAsync(log);
            await _unitOfWork.SaveChangesAsync();

            return new CitizenResponseDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Address = citizen.Address,
                PhoneNumber = citizen.PhoneNumber
            };
        }

        public async Task<IEnumerable<CitizenResponseDto>> GetAllCitizensAsync()
        {
            var citizens = await _citizenRepository.GetAllCitizensAsync();

            if (!citizens.Any()) throw new Exception("Nuk ka qytetare!");

            return citizens.Select(c => new CitizenResponseDto
            {
                FirstName = c.User.FirstName,
                LastName = c.User.LastName,
                Address = c.Address,
                PhoneNumber = c.PhoneNumber
            }).ToList();
        }

        public async Task<CitizenResponseDto> UpdateCitizenAsync(UpdateCitizenDto dto, int id, int adminId, string ipAddress)
        {
            var citizen = await _citizenRepository.GetCitizenByIdAsync(id);
            if (citizen == null) throw new Exception("Qytetari nuk u gjet!");

            var oldValue = $"KomunaId: {citizen.KomunaId}, Phone: {citizen.PhoneNumber}, Address: {citizen.Address}";

            citizen.Update(dto.KomunaId, dto.PhoneNumber, dto.Address);
            citizen.SetUpdated(adminId);

            await _citizenRepository.UpdateCitizenAsync(citizen);
            await _unitOfWork.SaveChangesAsync();

            var newValue = $"KomunaId: {citizen.KomunaId}, Phone: {citizen.PhoneNumber}, Address: {citizen.Address}";
            var log = new AuditLog(adminId, "UPDATE", "CitizenProfile", citizen.Id, oldValue, newValue, ipAddress);
            await _auditRepository.AddAsync(log);
            await _unitOfWork.SaveChangesAsync();

            return new CitizenResponseDto
            {
                FirstName = citizen.User.FirstName,
                LastName = citizen.User.LastName,
                Address = citizen.Address,
                PhoneNumber = citizen.PhoneNumber
            };
        }

        public async Task<bool> DeleteCitizenAsync(int id, int adminId, string ipAddress)
        {
            var citizen = await _citizenRepository.GetCitizenByIdAsync(id);
            if (citizen == null) throw new Exception("Qytetari nuk u gjet!");

            citizen.Delete(adminId);
            await _citizenRepository.UpdateCitizenAsync(citizen);
            await _unitOfWork.SaveChangesAsync();

            var log = new AuditLog(adminId, "DELETE", "CitizenProfile", citizen.Id, null, null, ipAddress);
            await _auditRepository.AddAsync(log);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}