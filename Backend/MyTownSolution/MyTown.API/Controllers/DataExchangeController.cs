using Microsoft.AspNetCore.Mvc;
using MyTown.Application.Ports.InboundPorts;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataExchangeController : ControllerBase
    {
        private readonly IDataExchangeService _dataExchangeService;

        public DataExchangeController(IDataExchangeService dataExchangeService)
        {
            _dataExchangeService = dataExchangeService;
        }

        [HttpGet("export/{entityType}/{format}")]
        public async Task<IActionResult> Export(string entityType, string format)
        {
            try
            {
                byte[] fileBytes;
                string contentType;
                string fileName;

                switch (format.ToLower())
                {
                    case "csv":
                        fileBytes = await _dataExchangeService.ExportToCsvAsync(entityType);
                        contentType = "text/csv";
                        fileName = $"{entityType}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
                        break;
                    case "excel":
                        fileBytes = await _dataExchangeService.ExportToExcelAsync(entityType);
                        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        fileName = $"{entityType}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.xlsx";
                        break;
                    case "json":
                        fileBytes = await _dataExchangeService.ExportToJsonAsync(entityType);
                        contentType = "application/json";
                        fileName = $"{entityType}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.json";
                        break;
                    default:
                        return BadRequest($"Unsupported format: {format}. Use csv, excel, or json.");
                }

                return File(fileBytes, contentType, fileName);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Export failed: {ex.Message}");
            }
        }

        [HttpPost("import/{entityType}/{format}")]
        public async Task<IActionResult> Import(string entityType, string format, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var userId = GetUserId();
                if (!userId.HasValue)
                    return Unauthorized();

                string ipAddress = GetIpAddress();

                using var stream = file.OpenReadStream();

                var result = format.ToLower() switch
                {
                    "csv" => await _dataExchangeService.ImportFromCsvAsync(entityType, stream, userId.Value, ipAddress),
                    "excel" => await _dataExchangeService.ImportFromExcelAsync(entityType, stream, userId.Value, ipAddress),
                    "json" => await _dataExchangeService.ImportFromJsonAsync(entityType, stream, userId.Value, ipAddress),
                    _ => throw new ArgumentException($"Unsupported format: {format}. Use csv, excel, or json.")
                };

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Import failed: {ex.Message}");
            }
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            return string.IsNullOrEmpty(claim) ? null : int.Parse(claim);
        }

        private string GetIpAddress() =>
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";
    }
}
