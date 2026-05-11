using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MyTown.API.Hubs.Proposals;
using MyTown.Application.Authorization;
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

        private readonly IHubContext<ProposalsHub> _proposalsHub;
        public ProjectProposalController(IProjectProposalService projectProposalService,
            IHubContext<ProposalsHub> proposalsHub)
        {
            _projectProposalService = projectProposalService;
            _proposalsHub = proposalsHub;
        }

        [HttpPost]
        [Authorize(Policy = Permissions.CanCreateProjectProposal)]
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
                await _proposalsHub.Clients.All.SendAsync("PropozimiPublikohet", new
                {
                    message = "Nje projekt propozim i ri u publikua",
                    vota = result
                });


                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new { e.Message });
            }
        }

        [HttpGet("{proposalId}")]
        public async Task<IActionResult> GetProjectProposalById(int proposalId)
        {
            try
            {
                var result = await _projectProposalService.GetProjectProposalByIdAsync(proposalId);

                if (result == null)
                    return NotFound();

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new { e.Message });   
            }
           
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProposals()
        {
            try
            {
                var result = await _projectProposalService.GetAllProjectProposalsAsync();
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new { e.Message});
            }
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return string.IsNullOrEmpty(claim) ? null : int.Parse(claim);
        }
        private string GetIpAddress() =>
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? "IP Address e panjohur";
    }
}

