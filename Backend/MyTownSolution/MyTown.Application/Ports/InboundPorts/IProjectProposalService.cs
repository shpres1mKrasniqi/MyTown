

using MyTown.Application.DTOs.ProjectProposals;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IProjectProposalService
    {
        Task<ProjectProposalResponseDto> AddProjectProposalAsync(CreateProposal proposal, int userId, string ipAddress);
        
    }
}
