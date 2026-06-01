using MyTown.Application.DTOs.History;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IHistoryService
    {
        Task<IEnumerable<MunicipalityHistoryDto>> GetHistoryAsync(string? type = null, DateTime? from = null, DateTime? to = null);
        Task<byte[]> ExportPdfAsync(string? type, DateTime? from, DateTime? to);
    }
}
