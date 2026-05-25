using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.Authorization;
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
        [Authorize(Policy = Permissions.CanCreateMeetingRequest)]

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

                await _meetingRequestService.AddMeetingRequestAsync(dto, citizenId.Value, ipAddress);

                return Ok("Kerkesa per takim u regjistrua me sukses");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize(Policy = Permissions.CanViewMeetingRequests)]
        public async Task<IActionResult> GetMeetingRequests()
        {
            try
            {

                var result = await _meetingRequestService.GetAllMeetingRequestsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = Permissions.CanEditMeetingRequestStatus)]

        public async Task<IActionResult> UpdateMeetingRequestStatus(int id, [FromBody] UpdateMeetingRequestStatusDto dto)
        {
            try
            {

                var ipAddress = GetIpAddress();

                var staffId = GetStaffId();

                if (staffId == null)
                {
                    return BadRequest("CitizenId is required.");
                }

                await _meetingRequestService.UpdateAsync(id, dto, staffId.Value, ipAddress);
                return Ok("Statusi i kerkeses per takim u perditesua me sukses.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Permissions.CanDeleteMeetingRequest)]

        public async Task<IActionResult> DeleteSoftMeetingReq(int id)
        {
            try
            {

                var ipAddress = GetIpAddress();

                var citizenId = GetCitizenId();

                if (citizenId == null)
                {
                    return BadRequest("CitizenId is required.");
                }

                await _meetingRequestService.SoftDeleteProposalAsync(id, citizenId.Value, ipAddress);
                return Ok("Kerkesa per takim me kryetarin u largua me sukses.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
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
        private string GetIpAddress() =>
         HttpContext.Connection.RemoteIpAddress?.ToString() ?? "IP Address e panjohur";
    }
}
