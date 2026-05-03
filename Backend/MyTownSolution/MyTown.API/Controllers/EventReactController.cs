using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.DTOs.Events;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Domain.Enums;
using System.Security.Claims;

namespace MyTown.API.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventReactionsController : ControllerBase
    {
        private readonly IEventReactionService _reactionService;

        public EventReactionsController(IEventReactionService reactionService)
        {
            _reactionService = reactionService;
        }

        [HttpGet("{eventId:int}/reactions")]
        [AllowAnonymous]
        public async Task<IActionResult> GetReactions(int eventId, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetUserId();
                var result = await _reactionService.GetReactionsAsync(eventId, userId, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("{eventId:int}/reactions")]
        [Authorize]
        public async Task<IActionResult> ToggleReaction(int eventId, [FromBody] ToggleReactionDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetUserId();
                if (!userId.HasValue) return Unauthorized();

                var result = await _reactionService.ToggleReactionAsync(eventId, userId.Value, dto.ReactionType, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return string.IsNullOrEmpty(claim) ? null : int.Parse(claim);
        }
    }
}