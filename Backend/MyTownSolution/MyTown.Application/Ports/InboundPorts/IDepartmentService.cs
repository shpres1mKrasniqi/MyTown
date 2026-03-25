using MyTown.Application.DTOs.Department;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IDepartmentService
    {
        Task CreateAsync(CreateDepartment dto);
        Task<IEnumerable<DepartmentResponse>> GetAllAsync();
        Task<DepartmentResponse> GetByIdAsync(int id);
        Task UpdateAsync(int id,UpdateDepartment dto);
        Task DeleteAsync(int id);
    }
}
