using MyTown.Application.DTOs.Komuna;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IKomunaService
    {
        Task CreateAsync(CreateKomuna dto, int adminId);
        Task<IEnumerable<KomunaResponse>> GetAllAsync();
        Task<KomunaResponse> GetByIdAsync(int id);
        Task UpdateAsync(int id, UpdateKomuna dto, int adminId);
        Task DeleteAsync(int id, int userId);
    }
}
