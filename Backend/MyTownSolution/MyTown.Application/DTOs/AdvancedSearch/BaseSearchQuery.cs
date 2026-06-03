

namespace MyTown.Application.DTOs.AdvancedSearch
{
    public class BaseSearchQuery
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public string? SearchTerm { get; set; }

        public string? SortBy { get; set; }

        public bool SortDescending { get; set; } = false;
    }
}

