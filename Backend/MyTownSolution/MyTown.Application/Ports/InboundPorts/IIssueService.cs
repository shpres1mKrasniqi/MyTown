
using MyTown.Application.DTOs.Issues;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IIssueService
    {
        Task<IssueResponseDto> CreateIssueAsync(CreateIssueDto createIssueDto, int citizenId, int userId, string ipAddress);
        Task<IEnumerable<IssueResponseDto>> GetAllAsync();
        Task<IssueCategoryResponseDto?> GetByIdAsync(int id);

        Task UpdateIssueAsync(int id, UpdateIssueDto updateIssueDto, int userId, string ipAddress);
        Task DeleteAsync(int id, int userId, string ipAddress);
    }
}
