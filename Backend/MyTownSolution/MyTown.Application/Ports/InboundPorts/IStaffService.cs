using MyTown.Application.DTOs.StaffProfiles;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IStaffServices
    {

        Task<StaffResponseDto> AddStaffProfilesAsync(CreateStaffDto dto, int adminId, string ipAddress);

    }//Kqyr gmail
}
