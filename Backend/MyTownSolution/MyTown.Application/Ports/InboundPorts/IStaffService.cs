using MyTown.Application.DTOs.Staff;
using MyTown.Application.DTOs.StaffProfiles;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IStaffService
    {

        Task<StaffResponseDto> AddStaffProfilesAsync(CreateStaffDto dto, int adminId, string ipAddress);
        Task<IEnumerable<StaffResponseDto>> GetAllStafAsync();
        Task<StaffResponseDto> GetStaffByIdAsync(int id);
        Task<StaffResponseDto> UpdateAsync(int id,UpdateStaffDto dto, int adminId, string ipAddress);
        Task<StaffResponseDto> DeleteAsync(int id, int adminId, string ipAddress);

    }
}
