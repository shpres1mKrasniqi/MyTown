
using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface ICitizenRepository
    {
        Task AddCitizenAsync(CitizenProfile citizenProfile);
        Task<IEnumerable<CitizenProfile>> GetAll();
        Task<CitizenProfile> GetById(int id);
        Task UpdateAsync(CitizenProfile citizenProfile);

        Task<CitizenProfile?> GetByUserIdAsync(int userId);
        Task<List<CitizenProfile>> GetByKomunaIdAsync(int komunaId);
        Task SaveChangesAsync();

        Task<bool> ExistsByPersonalNumberAsync(string personalNumber);

        IQueryable<CitizenProfile> Query();
    }
}