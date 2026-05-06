

using Microsoft.AspNetCore.Http;
using MyTown.Domain.Entities;
using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.ProjectProposals
{
    public class CreateProposal
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;

        public decimal Budget { get; set; }

        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedEndDate { get; set; }

        public string? TenderWinnerCompany { get; set; }

        public DateTime VotingDeadline { get; set; }

        public int KomunaId { get; set; }

        public List<IFormFile>? Files { get; set; }
    }
}
