using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IStaffRepository
    {
        Task AddStaffAsync(StaffProfile staffProfile);
        Task<IEnumerable<StaffProfile>> GetAllAsync();
        Task<StaffProfile> GetByIdAsync(int id);
        Task UpdateAsync(StaffProfile staffProfile);
        Task SaveChangesAsync();
    }
}