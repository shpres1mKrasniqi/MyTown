using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.Authorization;
using MyTown.Application.DTOs.WorkSchedule;
using MyTown.Application.Ports.InboundPorts;
using System.Security.Claims;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkScheduleController : ControllerBase
    {
        private readonly IWorkScheduleService _workScheduleService;

        public WorkScheduleController(IWorkScheduleService workScheduleService)
        {
            _workScheduleService = workScheduleService;
        }


        [HttpPost]
        [Authorize(Policy = Permissions.CanCreateWorkSchedule)]
        public async Task<IActionResult> Create([FromBody] CreateWorkScheduleDto dto)
        {
            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(adminIdClaim))
                return Unauthorized();

            int adminId = int.Parse(adminIdClaim);
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            var result = await _workScheduleService.CreateWorkScheduleAsync(dto, adminId, ip);

            return Ok(new
            {
                message = "Orari u krijua me sukses",
                data = result
            });
        }


        [HttpPut("{id}")]
        [Authorize(Policy = Permissions.CanEditWorkSchedule)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateWorkScheduleDto dto)
        {
            try
            {
                var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(adminIdClaim))
                    return Unauthorized();

                int adminId = int.Parse(adminIdClaim);

                var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Perdoruesi i panjohur";

                await _workScheduleService.UpdateWorkScheduleAsync(id, dto, adminId, ip);

                return Ok(new { message = "Orari u perditsua me sukses" });
            }
            catch (Exception e)
            {
                return BadRequest(new { e.Message });
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Policy = Permissions.CanDeleteWorkSchedule)]
        public async Task<IActionResult> Delete(int id)
        {
            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(adminIdClaim))
                return Unauthorized();

            int adminId = int.Parse(adminIdClaim);

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            await _workScheduleService.DeleteWorkScheduleAsync(id, adminId, ip);

            return Ok(new { message = "Orari u fshi me sukses" });
        }


        [HttpGet]
        [Authorize(Policy = Permissions.CanViewWorkSchedule)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _workScheduleService.GetAllAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("{id}")]
        [Authorize(Policy = Permissions.CanViewWorkSchedule)]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _workScheduleService.GetByIdAsync(id);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}






