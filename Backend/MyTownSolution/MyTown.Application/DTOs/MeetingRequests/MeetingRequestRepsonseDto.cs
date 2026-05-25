

using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.MeetingRequests
{
    public class MeetingRequestResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string Reason { get; set; }

        public MeetingRequestStatus Status { get; set; }

        public DateTime DateOfMeeting { get; set; }
    }
}
