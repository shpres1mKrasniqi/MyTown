

using MyTown.Domain.Entities;


namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IMeetingRequestRepository
    {
        Task AddMeetingRequestAsync(MeetingRequest meetingRequest);

        Task<MeetingRequest?> GetMeetingRequestById(int id);

        Task<IEnumerable<MeetingRequest>> GetMeetingRequestsAsync();

        public void Update(MeetingRequest meetingRequest);

        void DeleteMeetingRequest(MeetingRequest meetingRequest);
    }
}
