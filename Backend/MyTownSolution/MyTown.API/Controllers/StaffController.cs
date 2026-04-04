using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.DTOs.StaffProfiles;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Infrastructure.Security;
using System.Security.Claims;

namespace MyTown.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StaffController : ControllerBase
    {
        private readonly IStaffServices _staffService;

        public StaffController(IStaffServices staffService)
        {
            _staffService = staffService;
        }

        [HttpPost]
        [HasPermission("CanCreateStaff")]
        public async Task<IActionResult> CreateStaff([FromBody] CreateStaffDto dto)
        {

            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminIdClaim)) return Unauthorized();

            int adminId = int.Parse(adminIdClaim);
            string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";

            try
            {
                var staffResponse = await _staffService.AddStaffProfilesAsync(dto, adminId, ipAddress);

                return Ok(new
                {
                    message = "Stafi u krijua me sukses",
                    data = staffResponse
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}