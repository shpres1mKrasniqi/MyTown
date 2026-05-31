using MyTown.Domain;
using MyTown.Domain.Entities;


namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IHistoryRepository
    {
        Task<IEnumerable<Event>> GetEventsAsync();
        Task<IEnumerable<ProjectProposal>> GetProjectsAsync();
        Task<IEnumerable<MeetingRequest>> GetMeetingsAsync();
        Task<IEnumerable<ConstructionPermitRequest>> GetConstructionPermitsAsync();
    }
}
