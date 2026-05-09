
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.DTOs.IdScan;
using MyTown.Application.Ports.InboundPorts;

namespace MyTown.API.Controllers
{
    [ApiController]
    [Route("api/id-scan")]
    public class IdScanController : ControllerBase
    {
        private readonly IIdScanService _idScanService;

        public IdScanController(IIdScanService idScanService)
        {
            _idScanService = idScanService;
        }

        [HttpPost("extract")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<IdScanResultDto>> ExtractFromDocument(
            IFormFile document,
            CancellationToken cancellationToken)
        {
            try
            {
                if (document is null || document.Length == 0)
                    return BadRequest("No document uploaded.");

                if (!IsAllowedMimeType(document.ContentType))
                    return BadRequest("Only JPEG, PNG, or PDF documents are accepted.");

                if (document.Length > 5 * 1024 * 1024) 
                    return BadRequest("File size must not exceed 5MB.");

                await using var stream = document.OpenReadStream();
                var result = await _idScanService.ExtractIdDataAsync(stream, cancellationToken);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new
                {
                    message = e.Message,
                    innerMessage = e.InnerException?.Message
                });
            }

        }

        private static bool IsAllowedMimeType(string contentType) =>
     contentType is "image/jpeg"
     or "image/jpg"
     or "image/png"
     or "image/heic"
     or "image/heif"
     or "application/pdf";
    }
}
