using MyTown.Application.DTOs.Department;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Domain.Entities;
using System.Collections;

namespace MyTown.Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IAuditRepository _auditRepository;

        public DepartmentService(IDepartmentRepository departmentRepository, IAuditRepository auditRepository)
        {
            _departmentRepository = departmentRepository;
            _auditRepository = auditRepository;
        }
        public async Task CreateAsync(CreateDepartment dto, int adminId, string ipAddress)
        {
            if(await _departmentRepository.ExistsByNameAsync(dto.Name, dto.KomunaId))
            {
                throw new Exception($"Department me kete emer '{dto.Name}' tashme ekziston ne kete komune.");
            }
            var dep = new Department(dto.Name, dto.Description, dto.KomunaId);

            dep.SetCreated(adminId);

            await _departmentRepository.AddAsync(dep);
            await _departmentRepository.SaveChangesAsync();

            var log = new AuditLog(
                adminId,
                "CREATE",
                "Department",
                dep.Id,
                null, 
                $"U krijua departamenti: {dep.Name}",
                ipAddress
            );

            await _auditRepository.AddAsync(log);
            await _departmentRepository.SaveChangesAsync();



        }
        public async Task UpdateAsync(int id, UpdateDepartment dto, int userId, string ipAddress)
        {
            var dep = await _departmentRepository.GetByIdAsync(id);
            if(dep == null)
            {
                throw new Exception($"Department me id '{id}' nuk u gjet.");
            }
            if(dep.Name != dto.Name && dep.KomunaId == dep.KomunaId && await _departmentRepository.ExistsByNameAsync(dto.Name, dep.KomunaId))
            {
                throw new Exception($"Department me kete emer '{dto.Name}' tashme ekziston ne kete komune.");
            }
            dep.Update(dto.Name, dto.Description);

            dep.SetUpdated(userId);

            await _departmentRepository.UpdateAsync(dep);
            await _departmentRepository.SaveChangesAsync();

            var oldValue = $"Name: {dep.Name}, Description: {dep.Description}";

            dep.Update(dto.Name, dto.Description);
            dep.SetUpdated(userId);

            await _departmentRepository.UpdateAsync(dep);
            await _departmentRepository.SaveChangesAsync();

           
            var newValue = $"Name: {dep.Name}, Description: {dep.Description}";

          
            var log = new AuditLog(
                userId,
                "UPDATE",
                "Department",
                dep.Id,
                oldValue,
                newValue,
                ipAddress
            );

            await _auditRepository.AddAsync(log);
            await _departmentRepository.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id,int adminId, string ipAddress)
        {
            var dep = await _departmentRepository.GetByIdAsync(id);
            if(dep == null)
            {
                throw new Exception($"Department me id '{id}' nuk u gjet.");
            }
            var oldValue = $"Name: {dep.Name}, IsActive: {dep.IsActive}";

            dep.Deactivate();
            dep.SetUpdated(adminId); 

            await _departmentRepository.UpdateAsync(dep);
            await _departmentRepository.SaveChangesAsync();

            
            var newValue = $"Name: {dep.Name}, IsActive: {dep.IsActive}";

            var log = new AuditLog(
                adminId,
                "SOFT_DELETE",
                "Department",
                dep.Id,
                oldValue,
                newValue,
                ipAddress
            );

            await _auditRepository.AddAsync(log);
            await _departmentRepository.SaveChangesAsync();
        }
        public async Task<IEnumerable<DepartmentResponse>> GetAllAsync()
        {
            var departments = await _departmentRepository.GetAllAsync();
            return departments.Select(d => new DepartmentResponse(
                d.Id,
                d.Name,
                d.Description,
                d.IsActive,
                d.KomunaId,
                d.CreatedAt,
                d.UpdatedAt,
                d.CreatedBy,
                d.UpdatedBy

                ));
        }
        public async Task<DepartmentResponse> GetByIdAsync(int id)
        {
            var dep = await _departmentRepository.GetByIdAsync(id);
            if(dep == null)
            {
                throw new Exception("Departmenti me id: '{id}' nuk u gjet.");
            }
            return new DepartmentResponse(
                dep.Id,
                dep.Name,
                dep.Description,
                dep.IsActive,
                dep.KomunaId,
                dep.CreatedAt,
                dep.UpdatedAt,
                dep.CreatedBy,
                dep.UpdatedBy
            );
        }
    }
}
