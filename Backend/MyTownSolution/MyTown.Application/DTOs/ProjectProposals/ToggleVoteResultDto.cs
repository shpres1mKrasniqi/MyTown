

using MyTown.Application.DTOs.Events;
using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.ProjectProposals
{
    public class ToggleVoteResultDto
    {
        public bool Voted { get; set; }
        public ProposalVoteType? VoteType { get; set; }
        public ProposalVotesSummaryDto Summary { get; set; }
    }
}
