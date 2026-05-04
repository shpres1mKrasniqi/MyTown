using MyTown.Domain.Entities;
namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IEventRepository
    {
        Task AddAsync( Event ev);
        Task<IEnumerable<Event>> GetAllAsync();
        Task<Event>? GetByIdAsync(int id);
        Task UpdateAsync( Event ev);


       


    }
}
