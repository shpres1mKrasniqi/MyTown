using MyTown.Application.DTOs.Citizens;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface ICitizenService
    {
        Task<CitizenResponseDto> CreateCitizenAsync(CreateCitizenDto createCitizen, int adminId, string ipAddress);
    }
}