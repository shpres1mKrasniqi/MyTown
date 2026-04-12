

using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IFileRepository
    {
        Task AddFileAsync(MyTownFile file);
        Task <IEnumerable<MyTownFile>> ReadFilesAsync();
    }
}
