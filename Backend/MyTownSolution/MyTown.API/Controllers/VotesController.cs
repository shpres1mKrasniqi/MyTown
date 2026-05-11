using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MyTown.API.Hubs.Problems;
using MyTown.API.Hubs.Votat;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Domain.Enums;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VotesController : ControllerBase
    {
        private readonly IProposalVotes _proposalVotes;
        private readonly IHubContext<VotatHub> _hub;

        public VotesController(IProposalVotes proposalVotes, IHubContext<VotatHub> votatHub)
        {
            _proposalVotes = proposalVotes;
            _hub = votatHub;
        }

        [HttpPost("{projectProposalId}/vote")]
        
        public async Task<IActionResult> Voto(
    int projectProposalId,
    [FromBody] ProposalVoteType llojiVotes,
    CancellationToken cancellationToken)
        {
            try
            {
                var citizenId = GetCitizenId();

                if (citizenId == null)
                {
                    return Unauthorized("Nuk mundem te marrim Id e Qytetarit");
                }

                var result = await _proposalVotes.ToggleVoteAsync(
                    projectProposalId,
                    citizenId.Value,
                    llojiVotes,
                    cancellationToken);

                await _hub.Clients.All.SendAsync("VotimiUkrye", new
                {
                    message = "Nje vote e re u shtua",
                    vota = result
                });

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new { e.Message });
            }
        }

        [HttpGet("{projectProposalId}")]
        public async Task<IActionResult> GetVotes(
    int projectProposalId,
    CancellationToken cancellationToken)
        {

            try
            {
                int? citizenId = GetCitizenId();

                var result = await _proposalVotes.GetVotesAsync(
                    projectProposalId,
                    citizenId,
                    cancellationToken);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new { e.Message });
            }
          
        }

        private int? GetCitizenId()
        {
            var claim = User.FindFirst("CitizenId")?.Value;
            return (int.TryParse(claim, out int id)) ? id : null;
        }

    }
}
