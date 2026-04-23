using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.DTOs.Issues;
using MyTown.Application.Ports.InboundPorts;
using System.Security.Claims;

namespace MyTown.API.Controllers;

[Route("api/issues")]
[ApiController]
public class IssueInteractionsController : ControllerBase
{
    private readonly IPostInteractionService _interactions;

    public IssueInteractionsController(IPostInteractionService interactions)
    {
        _interactions = interactions;
    }

    [HttpGet("{issueId:int}/likes")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLikes(int issueId, CancellationToken cancellationToken)
    {
        try
        {
            var userId = GetUserId();
            var summary = await _interactions.GetLikeSummaryAsync(issueId, userId, cancellationToken);
            return Ok(summary);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{issueId:int}/likes/toggle")]
    [Authorize]
    public async Task<IActionResult> ToggleLike(int issueId, CancellationToken cancellationToken)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
                return Unauthorized();

            var result = await _interactions.ToggleLikeAsync(issueId, userId.Value, cancellationToken);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{issueId:int}/comments")]
    [AllowAnonymous]
    public async Task<IActionResult> GetComments(int issueId, CancellationToken cancellationToken)
    {
        try
        {
            var list = await _interactions.GetCommentsAsync(issueId, cancellationToken);
            return Ok(list);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{issueId:int}/comments")]
    [Authorize]
    public async Task<IActionResult> AddComment(int issueId, [FromBody] CreatePostCommentDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
                return Unauthorized();

            var created = await _interactions.AddCommentAsync(issueId, userId.Value, dto, cancellationToken);
            return Ok(created);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private int? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim)) return null;
        return int.Parse(claim);
    }
}
