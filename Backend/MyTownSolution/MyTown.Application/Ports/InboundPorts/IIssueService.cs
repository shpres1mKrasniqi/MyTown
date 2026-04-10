
using MyTown.Application.DTOs.Issues;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IIssueService
    {
        Task<IssueResponseDto> CreateIssueAsync(CreateIssueDto createIssueDto, int citizenId, int userId, string ipAddress);
    }
}
