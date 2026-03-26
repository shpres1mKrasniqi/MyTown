using MyTown.Application.DTOs.Department;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IDepartmentService
    {
        Task CreateAsync(CreateDepartment dto, int userId);
        Task<IEnumerable<DepartmentResponse>> GetAllAsync();
        Task<DepartmentResponse> GetByIdAsync(int id);
        Task UpdateAsync(int id,UpdateDepartment dto, int userId);
        Task DeleteAsync(int id);
    }
}
