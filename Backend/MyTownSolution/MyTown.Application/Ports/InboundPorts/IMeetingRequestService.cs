

using MyTown.Application.DTOs.AdvancedSearch;
using MyTown.Application.DTOs.MeetingRequests;


namespace MyTown.Application.Ports.InboundPorts
{
    public interface IMeetingRequestService
    {
        Task AddMeetingRequestAsync(AddMeetingRequestDto dto, int citizenId,int komunaId, string ipAddress);

        Task<IEnumerable<MeetingRequestResponseDto>> GetAllMeetingRequestsAsync();

        Task<MeetingRequestResponseDto> GetMeetingRequestsByIdAsync(int requestId);

        Task SoftDeleteProposalAsync(int id, int citizenId, string ipAddress);

        Task UpdateAsync(int id, UpdateMeetingRequestStatusDto dto, int staffId, string ipAddress);

    }
}
