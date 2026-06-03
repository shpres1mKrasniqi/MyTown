using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IStaffRepository
    {
        Task AddStaffAsync(StaffProfile staffProfile);
        Task<IEnumerable<StaffProfile>> GetAllAsync();
        Task<StaffProfile> GetByIdAsync(int id);
        Task<StaffProfile?> GetByUserIdAsync(int userId);
        Task<List<StaffProfile>> GetByKomunaIdAsync(int komunaId);
        Task UpdateAsync(StaffProfile staffProfile);
        Task SaveChangesAsync();

        IQueryable<StaffProfile> Query();
    }
}