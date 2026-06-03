
using MyTown.Application.DTOs.AdvancedSearch;
using MyTown.Application.DTOs.MeetingRequests;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IAdvancedMeetingRequestSearch
    {
        Task<PaginationResponse<MeetingRequestResponseDto>> SearchMeetingRequestsAsync(MeetingRequestSearchDto query);
    }
}
