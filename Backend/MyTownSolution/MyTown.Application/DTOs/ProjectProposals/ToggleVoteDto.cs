
using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.ProjectProposals
{
    public class ToggleVoteDto
    {
        public int ProjectProposalId { get; set; }
        public int CitizenId { get; set; }
        public ProposalVoteType VoteType { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
