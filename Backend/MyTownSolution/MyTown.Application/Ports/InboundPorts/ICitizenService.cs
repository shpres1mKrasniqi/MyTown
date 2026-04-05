using MyTown.Application.DTOs.Citizens;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface ICitizenService
    {
        Task<CitizenResponseDto> CreateCitizenAsync(CreateCitizenDto createCitizen, int adminId, string ipAddress);
        Task<IEnumerable<CitizenResponseDto>> GetAllCitizensAsync();
        Task<CitizenResponseDto> GetCitizenByIdAsync(int id);
        Task<CitizenResponseDto> UpdateCitizenAsync(int id, UpdateCitizenDto updateCitizen, int adminId, string ipAddress);
        Task DeleteCitizenAsync(int id);

    }
}