using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface ICitizenRepository
    {
        Task AddCitizenAsync(CitizenProfile citizenProfile);
        Task<IEnumerable<CitizenProfile>> GetAllCitizensAsync();
        Task<CitizenProfile> GetCitizenByIdAsync(int id);
        Task UpdateCitizenAsync(CitizenProfile citizenProfile);
    }
}