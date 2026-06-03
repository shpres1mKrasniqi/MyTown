
namespace MyTown.Application.DTOs.AdvancedSearch
{
    public class StaffSearch : BaseSearchQuery
    {

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public int? DepartmentId { get; set; }

        public string? Position { get; set; }

    }
}
