

using Microsoft.AspNetCore.Http;

namespace MyTown.Application.DTOs.ProjectProposals
{
    public class UpdateProjectProposalDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Budget { get; set; }
        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedEndDate { get; set; }
        public string? TenderWinnerCompany { get; set; }
        public DateTime VotingDeadline { get; set; }
        public int KomunaId { get; set; }
        public List<IFormFile>? Files { get; set; }
        public List<int>? DeletedFileIds { get; set; }
    }
}
