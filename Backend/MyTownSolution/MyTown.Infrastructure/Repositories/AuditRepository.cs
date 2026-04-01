using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class AuditRepository : IAuditRepository
    {
        private readonly MyTownDbContext _context;

        public AuditRepository(MyTownDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(AuditLog log)
        {
            await _context.AuditLogs.AddAsync(log);
        }
    }
}
