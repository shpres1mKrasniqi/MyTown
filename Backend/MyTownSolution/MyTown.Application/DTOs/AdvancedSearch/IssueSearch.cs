

using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.AdvancedSearch
{
    public class IssueSearch : BaseSearchQuery
    {
        public int? MunicipalityId { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public IssueStatus? Status { get; set; }
    }
}
