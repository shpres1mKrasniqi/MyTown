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
        private readonly IStaffService _staffService;

        public StaffController(IStaffService staffService)
        {
            _staffService = staffService;
        }

      
        [HttpPost]
        [Authorize(Policy = Permissions.CanCreateStaff)]
        public async Task<IActionResult> CreateStaff([FromBody] CreateStaffDto dto)
        {
            var adminId = GetAdminId();
            if (adminId == null) return Unauthorized();

            string ipAddress = GetIpAddress();

            try
            {
                var response = await _staffService.AddStaffProfilesAsync(dto, adminId.Value, ipAddress);

                return Ok(new
                {
                    message = "Stafi u krijua me sukses",
                    data = response
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

      
        [HttpGet]
        [Authorize(Policy = Permissions.CanViewStaff)]
        public async Task<IActionResult> GetAllStaff()
        {
            var staff = await _staffService.GetAllStafAsync();
            return Ok(staff);
        }

     
        [HttpGet("{id}")]
        [Authorize(Policy = Permissions.CanViewStaff)]
        public async Task<IActionResult> GetStaffById(int id)
        {
            try
            {
                var staff = await _staffService.GetStaffByIdAsync(id);
                return Ok(staff);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

       
        [HttpPut("{id}")]
        [Authorize(Policy = Permissions.CanEditStaff)]
        public async Task<IActionResult> UpdateStaff(int id, [FromBody] UpdateStaffDto dto)
        {
            var adminId = GetAdminId();
            if (adminId == null) return Unauthorized();

            string ipAddress = GetIpAddress();

            try
            {
                var response = await _staffService.UpdateAsync(id, dto, adminId.Value, ipAddress);

                return Ok(new
                {
                    message = "Stafi u përditësua me sukses",
                    data = response
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

      
        [HttpDelete("{id}")]
        [Authorize(Policy = Permissions.CanDeleteStaff)]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var adminId = GetAdminId();
            if (adminId == null) return Unauthorized();

            string ipAddress = GetIpAddress();

            try
            {
                var response = await _staffService.DeleteAsync(id, adminId.Value, ipAddress);

                return Ok(new
                {
                    message = "Stafi u fshi me sukses",
                    data = response
                });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        private int? GetAdminId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claim)) return null;

            return int.Parse(claim);
        }

        private string GetIpAddress()
        {
            return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";
        }
    }
}