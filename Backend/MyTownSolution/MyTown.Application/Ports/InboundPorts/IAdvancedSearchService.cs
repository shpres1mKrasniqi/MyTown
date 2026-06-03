

using MyTown.Application.DTOs.AdvancedSearch;
using MyTown.Application.DTOs.Citizens;
using MyTown.Application.DTOs.Department;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IAdvancedSearchService
    {
        Task<PaginationResponse<IssueResponseDto>> SearchIssuesAsync(IssueSearch query);
        Task<PaginationResponse<DepartmentResponse>> SearchDepartmentsAsync(DepartmentSearch query);

        Task<PaginationResponse<CitizenResponseDto>> SearchCitizensAsync(CitizenSearch query);
    }
}
