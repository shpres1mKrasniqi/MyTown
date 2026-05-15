using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface ISettingRepository
    {
        Task<Setting?> GetByKeyAsync(string key);
        Task UpdateAsync(Setting setting);
    }
}
