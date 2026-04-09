using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class WorkScheduleRepository : IWorkScheduleRepository
    {
        private readonly MyTownDbContext _context;
        public WorkScheduleRepository(MyTownDbContext context)
        {
            _context = context;
        }
        public async Task CreateWorkScheduleAsync(WorkSchedule workSchedule)
        {
            await _context.WorkSchedules.AddAsync(workSchedule);

        }
        public async Task<WorkSchedule> GetWorkScheduleByIdAsync(int id)
        {
            return await _context.WorkSchedules
            .Include(ws => ws.StaffProfile)
                  .ThenInclude(sp => sp.User)
                .FirstOrDefaultAsync(ws => ws.Id == id && !ws.IsDeleted);
        }

        public async Task<IEnumerable<WorkSchedule>> GetAllWorkSchedulesAsync()
        {
            return await _context.WorkSchedules
            .Include(ws => ws.StaffProfile)
                  .ThenInclude(sp => sp.User)
                  .Where(ws => !ws.IsDeleted)
                 .ToListAsync();
        }

        public async Task UpdateAsync(WorkSchedule ws)
        {
            _context.WorkSchedules.Update(ws);
        }

    }
}
