

using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IProjectProposalRepository
    {
        Task AddProjectProposalAsync(ProjectProposal proposal);
        Task<IEnumerable<ProjectProposal>> GetAllProposalsAsync();
        Task<ProjectProposal?> GetProjectProposalsByIdAsync(int proposalId);
    }
}
