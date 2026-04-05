namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IUnitOfWork
    {
        Task SaveChangesAsync();
    }
}