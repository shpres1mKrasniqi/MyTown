using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IStaffRepository
    {
        Task AddStaffAsync(StaffProfile staffProfile);
    }
}