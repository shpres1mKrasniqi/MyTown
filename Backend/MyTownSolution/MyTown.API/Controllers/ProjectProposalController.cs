using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.DTOs.ProjectProposals;
using MyTown.Application.Ports.InboundPorts;
using System.Security.Claims;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectProposalController : ControllerBase
    {
        private readonly IProjectProposalService _projectProposalService;


        public ProjectProposalController(IProjectProposalService projectProposalService)
        {
            _projectProposalService = projectProposalService;
        }

        [HttpPost]
        [Authorize]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateProjectProposal([FromForm] CreateProposal request)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized("User ID is missing in the token.");

            var ipAddress = GetIpAddress();

            try
            {
                var result = await _projectProposalService.AddProjectProposalAsync(
                    request,
                    userId.Value,
                    ipAddress
                );

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new { e.Message });
            }
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return string.IsNullOrEmpty(claim) ? null : int.Parse(claim);
        }
        private int? GetStaffId()
        {
            var claim = User.FindFirst("StaffId")?.Value;
            return int.TryParse(claim, out int id) ? id : null;
        }

        private string GetIpAddress() =>
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? "IP Address e panjohur";
    }
}

