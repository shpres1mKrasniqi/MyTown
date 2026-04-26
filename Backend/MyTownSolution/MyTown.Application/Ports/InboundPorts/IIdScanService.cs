using MyTown.Application.DTOs.IdScan;


namespace MyTown.Application.Ports.InboundPorts
{
    public interface IIdScanService
    {
        Task<IdScanResultDto> ExtractIdDataAsync(Stream documentStream, CancellationToken ct);
    }
}
