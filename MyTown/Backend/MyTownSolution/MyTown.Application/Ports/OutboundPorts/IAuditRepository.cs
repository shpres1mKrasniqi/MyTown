using MyTown.Domain.Common;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IAuditRepository
    {
        Task AddAsync(AuditLog log);
    }
}