using MyTown.Application.DTOs.Department;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IDepartmentService
    {
        Task CreateAsync(CreateDepartment dto, int adminId, string ipAddress);
        Task<IEnumerable<DepartmentResponse>> GetAllAsync();
        Task<DepartmentResponse> GetByIdAsync(int id);
        Task UpdateAsync(int id,UpdateDepartment dto, int adminId, string ipAddress);
        Task DeleteAsync(int id,int adminId, string ipAddress);
    }
}
