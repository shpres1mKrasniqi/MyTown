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

        public async Task<IEnumerable<StaffListDto>> GetAllStaffAsync()
        {
            var staffs = await _staffRepository.GetAllStaff();

            var result = staffs.Select(s => new StaffListDto
            {
                Id = s.Id,
                FirstName = s.User.FirstName,     
                LastName = s.User.LastName,
                Email = s.User.Email,             
                Position = s.Position,
                DepartmentName = s.Department?.Name ?? "Nuk ka te dhena"
            }).ToList();

            return result;
        }

        public async Task<StaffResponseDto> UpdateStaffProfileAsync(UpdateStaffDto dto, int id, int adminId, string ipAddress)
        {
          
            var stafi = await _staffRepository.GetStaffProfileByIdAsync(id);

            if (stafi == null)
                throw new Exception("Stafi nuk u gjet!");

     
            var oldValue = $"FirstName: {stafi.User.FirstName}, LastName: {stafi.User.LastName}, Email: {stafi.User.Email}, " +
                           $"Position: {stafi.Position}, DateHired: {stafi.DateHired}, DepartmentId: {stafi.DepartmentId}";

    
            stafi.User.FirstName = dto.FirstName;
            stafi.User.LastName = dto.LastName;
            stafi.User.Email = dto.Email;

  
            stafi.Update(dto.Position, dto.DateHired, dto.DepartmentId);

      
            stafi.SetUpdated(adminId);

  
            await _unitOfWork.SaveChangesAsync();

 
            var newValue = $"FirstName: {stafi.User.FirstName}, LastName: {stafi.User.LastName}, Email: {stafi.User.Email}, " +
                           $"Position: {stafi.Position}, DateHired: {stafi.DateHired}, DepartmentId: {stafi.DepartmentId}";

   
            var log = new AuditLog(
                adminId,
                "UPDATE",
                "StaffProfile",
                stafi.Id,
                oldValue,
                newValue,
                ipAddress
            );

            await _auditRepository.AddAsync(log);
            await _unitOfWork.SaveChangesAsync();

     
            var response = new StaffResponseDto
            {
                FirstName = stafi.User.FirstName,
                LastName = stafi.User.LastName,
                Position = stafi.Position,
                DateHired = stafi.DateHired
            };

            return response;
        }

        public async Task<StaffResponseDto> SoftDeleteStaffAsync(int id, int adminId, string ipAddress)
        {
            var staff = await _staffRepository.GetStaffProfileByIdAsync(id);
            if (staff == null || staff.IsDeleted)
                throw new Exception("Stafi nuk u gjet ose eshte fshire!");

            var oldValue = $"Position: {staff.Position}, DateHired: {staff.DateHired}, DepartmentId: {staff.DepartmentId}, IsDeleted: {staff.IsDeleted}";

           
            staff.Delete(adminId);

            await _unitOfWork.SaveChangesAsync();

            var newValue = $"Position: {staff.Position}, DateHired: {staff.DateHired}, DepartmentId: {staff.DepartmentId}, IsDeleted: {staff.IsDeleted}";
            var log = new AuditLog(
                adminId,
                "SOFT_DELETE",
                "StaffProfile",
                staff.Id,
                oldValue,
                newValue,
                ipAddress
            );

            await _auditRepository.AddAsync(log);
            await _unitOfWork.SaveChangesAsync();

            return new StaffResponseDto
            {
                FirstName = staff.User.FirstName,
                LastName = staff.User.LastName,
                Position = staff.Position,
                DateHired = staff.DateHired
            };
        }
        public async Task<StaffListDto> GetStaffByIdAsync(int id)
        {
            var s = await _staffRepository.GetStaffProfileByIdAsync(id);
            if (s == null) throw new Exception("Stafi nuk u gjet");

            return new StaffListDto
            {
                Id = s.Id,
                FirstName = s.User.FirstName,
                LastName = s.User.LastName,
                Email = s.User.Email,
                Position = s.Position,
                DepartmentName = s.Department?.Name,
               
            };
        }
    }
}