using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IKomunaRepository
    {
        Task AddAsync(Komuna komuna);
        Task<IEnumerable<Komuna>> GetAllActiveAsync();
        Task<Komuna?> GetActiveByIdAsync(int id);
        Task<bool> ExistsByNameAsync(string name, int? excludeId);
        Task<bool> HasActiveDepartmentsAsync(int komunaId);
        Task UpdateAsync(Komuna komuna);
        Task SaveChangesAsync();
    }
}
