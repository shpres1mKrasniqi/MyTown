using MyTown.Application.DTOs.DataExchange;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IDataExchangeService
    {
        Task<byte[]> ExportToCsvAsync(string entityType);
        Task<byte[]> ExportToExcelAsync(string entityType);
        Task<byte[]> ExportToJsonAsync(string entityType);
        Task<ImportResultDto> ImportFromCsvAsync(string entityType, Stream fileStream, int userId, string ipAddress);
        Task<ImportResultDto> ImportFromExcelAsync(string entityType, Stream fileStream, int userId, string ipAddress);
        Task<ImportResultDto> ImportFromJsonAsync(string entityType, Stream fileStream, int userId, string ipAddress);
    }
}
