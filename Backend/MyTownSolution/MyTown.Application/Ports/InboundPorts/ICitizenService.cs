using MyTown.Application.DTOs.Citizens;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface ICitizenService
    {
        Task<CitizenResponseDto> CreateCitizenAsync(CreateCitizenDto createCitizen, int adminId, string ipAddress);
        Task<IEnumerable<CitizenResponseDto>> GetAllCitizensAsync();
        Task<CitizenResponseDto> UpdateCitizenAsync(UpdateCitizenDto dto, int id, int adminId, string ipAddress);
        Task<bool> DeleteCitizenAsync(int id, int adminId, string ipAddress);
    }
}