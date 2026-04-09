
using MyTown.Application.DTOs.Issues;
using MyTown.Application.DTOs.StaffProfiles;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IIssueCategoryService
    {
        Task<IssueCategoryResponseDto> AddIssueCategoryAsync(DTOs.Issues.CreateIssueCategoryDto createIssueCategoryDto, int adminId, string ipAddress);
        Task<IEnumerable<IssueCategoryResponseDto>> GetAllAsync();

        Task<IssueCategoryResponseDto?> GetByIdAsync(int id);

        Task UpdateIssueCategoryAsync(int id, UpdateIssueCategoryDto updateIssueCategoryDto, int adminId, string ipAddress);

        Task DeleteAsync(int id, int adminId, string ipAddress);
    }
}
