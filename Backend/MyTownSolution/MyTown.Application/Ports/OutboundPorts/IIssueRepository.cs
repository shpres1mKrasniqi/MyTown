

using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IIssueRepository
    {
        Task AddIssueAsync(Issue issue);
        Task <IEnumerable<Issue>> GetAllAsync();
        Task<Issue?> GetIssueByIdAsync(int id);

        Task Update(Issue issue);
    }
}
