

using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IIssueRepository
    {
        Task AddIssueAsync(Issue issue);
    }
}
