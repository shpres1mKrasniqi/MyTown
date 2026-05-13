

using MyTown.Application.DTOs.ProjectProposals;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IProjectProposalService
    {
        Task<ProjectProposalResponseDto> AddProjectProposalAsync(CreateProposal proposal, int userId, string ipAddress);
        Task<ProjectProposalResponseDto> GetProjectProposalByIdAsync(int proposalId);
        Task<IEnumerable<ProjectProposalResponseDto>> GetAllProjectProposalsAsync();

        Task SoftDeleteProposalAsync(int id, int staffId, string ipAddress);

        Task UpdateAsync(int id, UpdateProjectProposalDto dto, int staffId, string ipAddress);
    }
}
