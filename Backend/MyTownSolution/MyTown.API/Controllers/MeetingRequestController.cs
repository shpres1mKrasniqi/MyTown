using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.DTOs.MeetingRequests;
using MyTown.Application.Ports.InboundPorts;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingRequestController : ControllerBase
    {
        private readonly IMeetingRequestService _meetingRequestService;

        public MeetingRequestController(IMeetingRequestService meetingRequestService)
        {
            _meetingRequestService = meetingRequestService;
        }

        [HttpPost]

        public async Task<IActionResult> AddMeetingRequest([FromBody] AddMeetingRequestDto dto)
        {
            try
            {

                var ipAddress = GetIpAddress();

                var citizenId = GetCitizenId();

                if (citizenId == null)
                {
                    return BadRequest("CitizenId is required.");
                }

                var result = _meetingRequestService.AddMeetingRequestAsync(dto, citizenId.Value, ipAddress);

                return Ok("Kerkesa per takim u regjistrua me sukses");

            }
            catch (Exception ex)
            {
              return BadRequest(ex.Message);
            }
        }

        private int? GetCitizenId()
        {
            var claim = User.FindFirst("CitizenId")?.Value;
            return (int.TryParse(claim, out int id)) ? id : null;
        }
        private string GetIpAddress() =>
         HttpContext.Connection.RemoteIpAddress?.ToString() ?? "IP Address e panjohur";
    }
}
