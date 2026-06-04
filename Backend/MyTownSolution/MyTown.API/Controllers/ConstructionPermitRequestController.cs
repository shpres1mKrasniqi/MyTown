using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MyTown.Application;
using MyTown.API.Hubs.BuildingPermit;

namespace MyTown.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConstructionPermitRequestController : ControllerBase
    {
        private readonly IConstructionPermitRequestService _service;
        private readonly IHubContext<BuildingHub> _hub;

        public ConstructionPermitRequestController(IConstructionPermitRequestService service, IHubContext<BuildingHub> hub)
        {
            _service = service;
            _hub = hub;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllRequestsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetPermitReqById(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateConstructionPermitRequestDto dto)
        {
            var ipAddress = GetIpAddress();

            var citizenId = GetCitizenId();

            var komunaId = GetKomunaId();

            if (citizenId == null)
            {
                return BadRequest("CitizenId is required.");
            }
            if (komunaId == null)
            {
                return BadRequest("KomunaId is required.");
            }
            await _service.AddConstructionPermitRequestAsync(dto, citizenId.Value,komunaId.Value, ipAddress);

            await _hub.Clients.Group("Staff").SendAsync("BuildingPermitCreated", new
            {
                message = "Kerkesa per leje ndertimore u shtua me sukses.",
                
            });

            return Ok("Kërkesa u shtua me sukses.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateConstructionPermitRequestDto dto)
        {
            var ipAddress = GetIpAddress();
            var staffId = GetStaffId();

            if (staffId == null)
                return BadRequest("StaffId is required.");

            await _service.UpdatePermitRequestAsync(id, dto, staffId.Value, ipAddress);

            return Ok("Statusi u përditësua.");
        }
        [HttpPut("{id}/documents")]
        public async Task<IActionResult> UpdateDocuments(int id, [FromForm] UpdateConstructionDocumentsDto dto)
        {
            var ipAddress = GetIpAddress();
            var staffId = GetStaffId();

            if (staffId == null)
                return BadRequest("StaffId is required.");

            await _service.UpdateDocumentsAsync(id, dto, staffId.Value, ipAddress);

            return Ok("Dokumentet u përditësuan.");
        }

        [HttpDelete("{requestId}")]
        public async Task<IActionResult> Delete(int requestId)
        {
            var ipAddress = GetIpAddress();

            var citizenId = GetCitizenId();

            if (citizenId == null)
            {
                return BadRequest("CitizenId is required.");
            }
            await _service.SoftDeleteRequest(requestId, citizenId.Value, ipAddress);
            return Ok("Kërkesa u fshi.");
        }

        private int? GetStaffId()
        {
            var claim = User.FindFirst("StaffId")?.Value;
            return int.TryParse(claim, out int id) ? id : null;
        }
        private int? GetCitizenId()
        {
            var claim = User.FindFirst("CitizenId")?.Value;
            return int.TryParse(claim, out int id) ? id : null;
        }
        private int? GetKomunaId()
        {
            var claim = User.FindFirst("KomunaId")?.Value;
            return int.TryParse(claim, out int id) ? id : null;
        }
        private string GetIpAddress() =>
         HttpContext.Connection.RemoteIpAddress?.ToString() ?? "IP Address e panjohur";
    }
}