using MyTown.Application.DTOs.WorkSchedule;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IWorkScheduleService
    {

        Task<WorkScheduleResponseDto> CreateWorkScheduleAsync(CreateWorkScheduleDto workScheduleDto, int adminId, string ipAddress);

        Task DeleteWorkScheduleAsync(int id, int adminId, string ipAddress);

        Task UpdateWorkScheduleAsync(int id, UpdateWorkScheduleDto workScheduleDto, int adminId, string ipAddress);

        Task<IEnumerable<WorkScheduleResponseDto>> GetAllAsync();
        Task<WorkScheduleResponseDto> GetByIdAsync(int id);
    }
}

