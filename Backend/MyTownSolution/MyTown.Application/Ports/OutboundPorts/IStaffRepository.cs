using MyTown.Application.DTOs.StaffProfiles;
using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IStaffRepository
    {
        Task AddStaffAsync(StaffProfile staffProfile);

        Task<IEnumerable<StaffProfile>> GetAllStaff();

        Task UpdateStaffProfileAsync(StaffProfile staffProfile);

        Task<StaffProfile> GetStaffProfileByIdAsync(int id);


    }
}