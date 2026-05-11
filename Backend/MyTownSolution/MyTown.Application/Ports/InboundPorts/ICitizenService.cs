using MyTown.Application.DTOs.Citizens;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface ICitizenService
    {
        Task<CitizenResponseDto> CreateCitizenAsync(CreateCitizenDto createCitizen);
        Task<IEnumerable<CitizenResponseDto>> GetAllCitizensAsync();
        Task<CitizenResponseDto> GetCitizenByIdAsync(int id);
        Task<CitizenResponseDto> UpdateCitizenAsync(int id, UpdateCitizenDto updateCitizen);
        Task DeleteCitizenAsync(int id);

    }
}