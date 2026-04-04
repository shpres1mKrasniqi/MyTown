
using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface ICitizenRepository
    {
        Task AddCitizenAsync(CitizenProfile citizenProfile);
    }
}