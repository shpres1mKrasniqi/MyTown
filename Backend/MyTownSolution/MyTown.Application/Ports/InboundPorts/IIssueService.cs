
using MyTown.Application.DTOs.Issues;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IIssueService
    {
        Task<IssueResponseDto> CreateIssueAsync(CreateIssueDto createIssueDto, int citizenId, int userId, string ipAddress);
        Task<IEnumerable<IssueResponseDto>> GetAllAsync();
        Task<IssueResponseDto?> GetByIdAsync(int id);
        Task UpdateIssueDetailsAsync(int id, UpdateIssueDto dto, int citizenId, string ipAddress);

        Task UpdateIssueStatusAsync(int id, UpdateIssueStatusDto dto, int staffId, string ipAddress);
        Task DeleteAsync(int id, int userId, string ipAddress);
    }
}
