
using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.AdvancedSearch
{
    public class ProposalSearch :BaseSearchQuery
    {
        public int? MunicipalityId { get; set; }
        public ProjectProposalStatus? Status { get; set; }
    }
}
