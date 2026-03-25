using MyTown.Application.DTOs.Department;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Domain.Entities;


using MyTown.Application.Ports.OutboundPorts;

namespace MyTown.Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentService(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }
        public async Task CreateAsync(CreateDepartment dto)
        {
            if(await _departmentRepository.ExistsByNameAsync(dto.Name, dto.KomunaId))
            {
                throw new Exception($"Department me kete emer '{dto.Name}' tashme ekziston ne kete komune.");
            }
            var dep = new Department(dto.Name, dto.Description, dto.KomunaId);

            await _departmentRepository.AddAsync(dep);
            await _departmentRepository.SaveChangesAsync();
        }
        public async Task UpdateAsync(int id, UpdateDepartment dto)
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
            await _departmentRepository.UpdateAsync(dep);
            await _departmentRepository.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var dep = await _departmentRepository.GetByIdAsync(id);
            if(dep == null)
            {
                throw new Exception($"Department me id '{id}' nuk u gjet.");
            }
            dep.Deactivate(); 
            await _departmentRepository.UpdateAsync(dep);
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
