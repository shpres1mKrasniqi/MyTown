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

        public async Task<CitizenResponseDto> CreateCitizenAsync(CreateCitizenDto createCitizen)
        {

            if (await _citizenRepository.ExistsByPersonalNumberAsync(createCitizen.PersonalNumber))
                throw new Exception("Qytetari me kete numr personal ekziston.");

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
                createCitizen.Address,
                createCitizen.PersonalNumber,
                DateTime.Parse(createCitizen.DateOfBirth),
                createCitizen.Nationality,
                createCitizen.PlaceOfBirth
            );

            await _citizenRepository.AddCitizenAsync(citizen);
            await _unitOfWork.SaveChangesAsync();

            //var log = new AuditLog(
            //    adminId,
            //    "CREATE",
            //    "CitizenProfile",
            //    citizen.Id,
            //    null,
            //    $"Profili i Qytetarit u kriju: {user.Email}",
            //    ipAddress
            //);

            //await _auditRepository.AddAsync(log);

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
        public async Task<IEnumerable<CitizenResponseDto>> GetAllCitizensAsync()
        {
            var citizens = await _citizenRepository.GetAll();

            return citizens.Select(c => new CitizenResponseDto
            {
              
                FirstName = c.User.FirstName,
                LastName = c.User.LastName,
                Address = c.Address,
                PhoneNumber = c.PhoneNumber
            });
        
    }
        public async Task<CitizenResponseDto> GetCitizenByIdAsync(int id)
        {
            var citizen = await _citizenRepository.GetById(id);

            if (citizen == null)
                throw new Exception("Qytetari nuk u gjet!");

            return new CitizenResponseDto
            {
                FirstName = citizen.User.FirstName,
                LastName = citizen.User.LastName,
                Address = citizen.Address,
                PhoneNumber = citizen.PhoneNumber
            };
        }
        public async Task<CitizenResponseDto> UpdateCitizenAsync(int id, UpdateCitizenDto dto)
        {
            var citizen = await _citizenRepository.GetById(id);

            if (citizen == null)
                throw new Exception("Qytetari nuk u gjet!");

            var oldValue = $"FirstName: {citizen.User.FirstName}, LastName: {citizen.User.LastName}, Email: {citizen.User.Email}, " +
                           $"Address: {citizen.Address}, Phone: {citizen.PhoneNumber}";

            
            citizen.User.FirstName = dto.FirstName;
            citizen.User.LastName = dto.LastName;
            citizen.User.Email = dto.Email;

            
            citizen.Update(dto.KomunaId, dto.PhoneNumber, dto.Address);

            //citizen.SetUpdated(adminId);

            await _unitOfWork.SaveChangesAsync();

            var newValue = $"FirstName: {citizen.User.FirstName}, LastName: {citizen.User.LastName}, Email: {citizen.User.Email}, " +
                           $"Address: {citizen.Address}, Phone: {citizen.PhoneNumber}";

            //var log = new AuditLog(
            //    adminId,
            //    "UPDATE",
            //    "CitizenProfile",
            //    citizen.Id,
            //    oldValue,
            //    newValue,
            //    ipAddress
            //);

            //await _auditRepository.AddAsync(log);
            await _unitOfWork.SaveChangesAsync();

            return new CitizenResponseDto
            {
                FirstName = citizen.User.FirstName,
                LastName = citizen.User.LastName,
                Address = citizen.Address,
                PhoneNumber = citizen.PhoneNumber
            };
        }
        public async Task DeleteCitizenAsync(int id)
        {
            var citizen = await _citizenRepository.GetById(id);

            if (citizen == null)
                throw new Exception("Qytetari nuk u gjet!");

            citizen.Delete();

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
