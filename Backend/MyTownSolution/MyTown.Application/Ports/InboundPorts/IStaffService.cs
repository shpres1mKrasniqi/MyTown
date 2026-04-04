using MyTown.Application.DTOs.Staff;
using MyTown.Application.DTOs.StaffProfiles;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IStaffServices
    {

        Task<StaffResponseDto> AddStaffProfilesAsync(CreateStaffDto dto, int adminId, string ipAddress);

        Task<IEnumerable<StaffListDto>> GetAllStaffAsync();

        Task<StaffResponseDto> UpdateStaffProfileAsync(UpdateStaffDto dto, int id, int adminId, string ipAddress);
        Task<StaffResponseDto> SoftDeleteStaffAsync(int id, int adminId, string ipAddress);

        Task<StaffListDto> GetStaffByIdAsync(int id);
    }
}
