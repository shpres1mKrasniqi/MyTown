using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IDepartmentRepository
    {
        Task AddAsync (Department department);
        Task<IEnumerable<Department>> GetAllAsync ();
        Task<Department> GetByIdAsync (int id);
        Task<bool> ExistsByNameAsync(string name, int komunaId);
        Task UpdateAsync(Department department);
        Task SaveChangesAsync();
    }
}
