
using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class MeetingRequestRepository : IMeetingRequestRepository
    {
        private readonly MyTownDbContext _context;

        public MeetingRequestRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task AddMeetingRequestAsync(MeetingRequest meetingRequest)
        {
            await _context.MeetingRequests.AddAsync(meetingRequest);

        }

        public async Task<MeetingRequest?> GetMeetingRequestById(int id)
        {
            return await _context.MeetingRequests.
                AsNoTracking()
                .Include(m=>m.Citizen)
                .Where(m => !m.IsDeleted)
                .FirstOrDefaultAsync(m=> m.Id ==id);
        }

        public async Task<IEnumerable<MeetingRequest>> GetMeetingRequestsAsync()
        {
            return await _context.MeetingRequests
                .AsNoTracking()
                .Where(m => !m.IsDeleted)
                .ToListAsync();
        }

        public void Update(MeetingRequest meetingRequest)
        {
            _context.MeetingRequests.Update(meetingRequest);
        }

        public void DeleteMeetingRequest(MeetingRequest meetingRequest)
        {
            _context.MeetingRequests.Update(meetingRequest);
        }
    }
}
