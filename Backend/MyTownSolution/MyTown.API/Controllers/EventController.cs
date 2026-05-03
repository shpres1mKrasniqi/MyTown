using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MyTown.API.Hubs;
using MyTown.API.Hubs.Problems;
using MyTown.Application.DTOs.Event;
using MyTown.Application.Ports.InboundPorts;
using System.Security.Claims;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly IHubContext<EventHub> _hub;

        public EventsController(IEventService eventService, IHubContext<EventHub> hub)
        {
            _eventService = eventService;
            _hub = hub;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateEventDto dto)
        {
            try
            {
                // ✅ Shto kete per debug
                Console.WriteLine($"Files nga Request.Form.Files: {Request.Form.Files.Count}");
                Console.WriteLine($"Files nga dto: {dto.Files?.Count ?? 0}");

                var userId = GetUserId();
                if (!userId.HasValue) return Unauthorized();

                var staffId = GetStaffId();
                if (!staffId.HasValue) return Unauthorized();

                var result = await _eventService.CreateEventAsync(dto, staffId.Value, userId.Value, GetIpAddress());
                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("{id}/publish")]
        public async Task<IActionResult> Publish(int id)
        {
            try
            {
                var userId = GetUserId();
                if (!userId.HasValue) return Unauthorized();

                await _eventService.PublishEventAsync(id, userId.Value, GetIpAddress());

                var ev = await _eventService.GetEventByIdAsync(id);

               
                await _hub.Clients
                    .Group($"komuna-{ev!.KomunaId}")
                    .SendAsync("EventPublished", new
                    {
                        message = $"Eventi i ri u publikua: {ev.Title}",
                        ev
                    });

                return Ok(new { message = "Eventi u publikua me sukses." });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var citizenId = GetCitizenId();
                var result = await _eventService.GetAllEventsAsync(citizenId);
                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var citizenId = GetCitizenId();
                var result = await _eventService.GetEventByIdAsync(id, citizenId);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
        [HttpGet("debug-claims")]
        public IActionResult DebugClaims()
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Ok(claims);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEventDto dto)
        {
            try
            {
                var userId = GetUserId();
                if (!userId.HasValue) return Unauthorized();

                await _eventService.UpdateAsync(id, dto, userId.Value, GetIpAddress());
                return Ok(new { message = "Eventi u përditësua me sukses." });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var userId = GetUserId();
                if (!userId.HasValue) return Unauthorized();

                await _eventService.DeleteAsync(id, userId.Value, GetIpAddress());
                return Ok(new { message = "Eventi u fshi me sukses." });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        
        [HttpPost("{id}/vote")]
        public async Task<IActionResult> Vote(int id)
        {
            try
            {
                var citizenId = GetCitizenId();
                if (!citizenId.HasValue) return Unauthorized();

                var userId = GetUserId();
                if (!userId.HasValue) return Unauthorized();

                var result = await _eventService.VoteAsync(id, citizenId.Value, userId.Value, GetIpAddress());

                
                await _hub.Clients
                    .Group($"komuna-{result.KomunaId}")
                    .SendAsync("EventVoteUpdated", new
                    {
                        eventId = result.Id,
                        voteCount = result.VoteCount
                    });

                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

       
        [HttpGet("winner/{komunaId}")]
        public async Task<IActionResult> GetWinner(int komunaId)
        {
            try
            {
                var result = await _eventService.GetWinnerAsync(komunaId);
                if (result == null) return NotFound(new { message = "Nuk ka fitues ende." });

               
                await _hub.Clients
                    .Group($"komuna-{komunaId}")
                    .SendAsync("EventWinnerAnnounced", new
                    {
                        message = $"🏆 Fitues: {result.Title} me {result.VoteCount} vota!",
                        winner = result
                    });

                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        private int? GetCitizenId()
        {
            var claim = User.FindFirst("CitizenId")?.Value;
            return int.TryParse(claim, out int id) ? id : null;
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
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";
    }
}