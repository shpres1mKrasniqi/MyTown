
using Microsoft.EntityFrameworkCore;
using MyTown.Application.DTOs.AdvancedSearch;
using MyTown.Application.DTOs.MeetingRequests;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;

namespace MyTown.Application.Services
{
    public class AdvancedMeetingRequestService : IAdvancedMeetingRequestSearch
    {

        private readonly IMeetingRequestRepository _meetingRequestRepository;

        public AdvancedMeetingRequestService(IMeetingRequestRepository meetingRequestRepository)
        {
            _meetingRequestRepository = meetingRequestRepository;
        }


        public async Task<PaginationResponse<MeetingRequestResponseDto>> SearchMeetingRequestsAsync(MeetingRequestSearchDto query)
        {
            var pageSize = query.PageSize > 0 ? query.PageSize : 10;
            var pageNumber = query.PageNumber > 0 ? query.PageNumber : 1;

            var meetingRequests = _meetingRequestRepository.Query();

            if (!string.IsNullOrWhiteSpace(query.Title))
            {
                var t = query.Title;
                meetingRequests = meetingRequests.Where(m =>
                    m.Title.Contains(t) || m.Reason.Contains(t));
            }
       

            if (query.Status.HasValue)
            {
                meetingRequests = meetingRequests.Where(m => m.Status == query.Status.Value);
            }

            var totalCount = await meetingRequests.CountAsync();

            var result = await meetingRequests
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MeetingRequestResponseDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Reason = m.Reason,
                    Status = m.Status,
                    DateOfMeeting = m.DateOfMeeting
                })
                .ToListAsync();

            return new PaginationResponse<MeetingRequestResponseDto>
            {
                Items = result,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
