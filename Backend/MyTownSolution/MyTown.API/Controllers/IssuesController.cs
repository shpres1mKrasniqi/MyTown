using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.DTOs.Issues;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Domain.Entities;
using System.Net;
using System.Security.Claims;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IssuesController : ControllerBase
    {
        private readonly IIssueService _issueService;

        public IssuesController(IIssueService issueService)
        {
            _issueService = issueService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateIssue([FromForm] CreateIssueDto createIssueDto)
        {
            try
            {
                var citizenId = GetCitizenId();


                if (!citizenId.HasValue)
                    return Unauthorized();

                var userId = GetUserId();

                if (!userId.HasValue)
                    return Unauthorized();

                string ipAddress = GetIpAddress();

                var result = await _issueService.CreateIssueAsync(createIssueDto, citizenId.Value, userId.Value, ipAddress);
                return Ok(result);
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

        private int? GetUserId()
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
