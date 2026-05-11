
using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.ProjectProposals
{
    public class ProposalVotesSummaryDto
    {
        public int ProjectProposalId { get; set; }
        public int ForVotes { get; set; }
        public int AgainstVotes { get; set; }
        public int TotalVotes { get; set; }
        public ProposalVoteType? MyVote { get; set; }
        public bool HasVoted { get; set; }
    }
}
