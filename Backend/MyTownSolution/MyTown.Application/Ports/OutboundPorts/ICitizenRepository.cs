
using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface ICitizenRepository
    {
        Task AddCitizenAsync(CitizenProfile citizenProfile);
        Task<IEnumerable<CitizenProfile>> GetAll();
        Task<CitizenProfile> GetById(int id);
        Task UpdateAsync(CitizenProfile citizenProfile);
        Task SaveChangesAsync();
    }
}