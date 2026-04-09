using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IWorkScheduleRepository
    {

        Task CreateWorkScheduleAsync(WorkSchedule workSchedule);

        Task<WorkSchedule> GetWorkScheduleByIdAsync(int id);

        Task<IEnumerable<WorkSchedule>> GetAllWorkSchedulesAsync();

        Task UpdateAsync(WorkSchedule ws);

    }
}
