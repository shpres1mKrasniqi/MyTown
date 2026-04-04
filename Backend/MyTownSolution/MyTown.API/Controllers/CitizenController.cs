using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.DTOs.Citizens;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Infrastructure.Security;
using System.Security.Claims;

namespace MyTown.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CitizenController : ControllerBase
    {
        private readonly ICitizenService _CitizenService;

        public CitizenController(ICitizenService citizenService)
        {
            _CitizenService = citizenService;
        }

        [HttpPost]
        [HasPermission("CanCreateCitizen")]
        public async Task<IActionResult> CreateCitizen([FromBody] CreateCitizenDto dto)
        {

            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminIdClaim)) return Unauthorized();

            int adminId = int.Parse(adminIdClaim);
            string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";

            try
            {
                var CitizenResponse = await _CitizenService.CreateCitizenAsync(dto, adminId, ipAddress);

                return Ok(new
                {
                    message = "qytetari u krijua me sukses",
                    data = CitizenResponse
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
