using MyTown.Application.DTOs.ProjectProposals;
using MyTown.Domain.Enums;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IProposalVotes
    {
        Task<ProposalVotesSummaryDto> GetVotesAsync(
            int projectProposalId,
            int? citizenId,
            CancellationToken cancellationToken = default);

        Task<ToggleVoteDto> ToggleVoteAsync(
            int projectProposalId,
            int citizenId,
            ProposalVoteType voteType,
            CancellationToken cancellationToken = default);
    }
}