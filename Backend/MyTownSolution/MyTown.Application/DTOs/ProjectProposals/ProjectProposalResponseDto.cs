

using MyTown.Application.DTOs.Files;
using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.ProjectProposals
{
    public class ProjectProposalResponseDto
    {
        public int Id { get; set; } 

        public string Title { get; set; }

        public string Description { get; set; }
        public decimal Budget { get; set; }
        public int KomunaId { get; set; }

        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedEndDate { get; set; }

        public string? TenderWinnerCompany { get; set; }

        public DateTime VotingDeadline { get; set; }

        public ProjectProposalStatus Status { get; set; }

        public List<MyTownFileResponseDto> Files { get; set; }
    }
}
