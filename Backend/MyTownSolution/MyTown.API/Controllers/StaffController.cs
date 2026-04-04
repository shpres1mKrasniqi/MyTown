using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.Authorization;
using MyTown.Application.DTOs.Staff;
using MyTown.Application.DTOs.StaffProfiles;
using MyTown.Application.Ports.InboundPorts;
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

        [HttpPost("AddStaffMember")]
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanCreateStaff)]
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

        [HttpGet("GetStaffMembers")]
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanViewStaff)]

        public async Task<IActionResult> GetAllStaffPersonel()
        {
            try
            {
                var response = await _staffService.GetAllStaffAsync();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message});
            }
        }

        [HttpPut("{id}/UpdateStaffProfile")]
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanUpdateStaff)]
        public async Task<IActionResult> UpdateStaff(int id, [FromBody] UpdateStaffDto dto)
        {
            if (dto == null) return BadRequest(new { message = "Te dhenat nuk jane plotsuar" });

            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminIdClaim)) return Unauthorized();

            int adminId = int.Parse(adminIdClaim);
            string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";

            try
            {
                var updatedStaff = await _staffService.UpdateStaffProfileAsync(dto, id, adminId, ipAddress);

                return Ok(new
                {
                    message = "Profili i stafit u perditsua me sukses",
                    data = updatedStaff
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}/DeleteStaffProfile")]
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanDeleteStaff)]
        public async Task<IActionResult> SoftDeleteStaff(int id)
        {
            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminIdClaim)) return Unauthorized();

            int adminId = int.Parse(adminIdClaim);
            string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";

            try
            {
                var deletedStaff = await _staffService.SoftDeleteStaffAsync(id, adminId, ipAddress);
                return Ok(new
                {
                    message = "Profili i stafit u fshi",
                    data = deletedStaff
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetStaffById(int id)
        {
            try
            {
                var response = await _staffService.GetStaffByIdAsync(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

    }
}