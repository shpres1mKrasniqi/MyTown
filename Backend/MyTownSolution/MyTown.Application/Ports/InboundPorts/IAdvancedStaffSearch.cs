

using MyTown.Application.DTOs.AdvancedSearch;
using MyTown.Application.DTOs.Citizens;
using MyTown.Application.DTOs.StaffProfiles;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IAdvancedStaffSearch
    {
        Task<PaginationResponse<StaffResponseDto>> SearchStaffAsync(StaffSearch query);
    }
}
