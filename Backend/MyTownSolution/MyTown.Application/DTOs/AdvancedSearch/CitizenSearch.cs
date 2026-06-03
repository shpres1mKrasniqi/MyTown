

namespace MyTown.Application.DTOs.AdvancedSearch
{
    public class CitizenSearch : BaseSearchQuery
    {
        public int? MunicipalityId { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }
    }
}
