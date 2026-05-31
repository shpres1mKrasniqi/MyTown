using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.Ports.InboundPorts;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService _historyService;

        public HistoryController(IHistoryService historyService)
        {
            _historyService = historyService;
        }
        [HttpGet]
        [Authorize(Policy = "CanViewHistory")]
        public async Task<IActionResult> GetHistory( [FromQuery] string? type, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            try
            {
                var result = await _historyService.GetHistoryAsync(type, from, to);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }
        [HttpGet("export-pdf")]
        [Authorize(Policy = "CanExportHistoryPdf")]
        public async Task<IActionResult> ExportPdf(
    [FromQuery] string? type,
    [FromQuery] DateTime? from,
    [FromQuery] DateTime? to)
        {
            var pdfBytes = await _historyService.ExportPdfAsync(type, from, to);

            return File(pdfBytes, "application/pdf", "historiku-komunes.pdf");
        }
    }
}
