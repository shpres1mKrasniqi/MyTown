using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MyTown.API.Hubs;
using MyTown.API.Hubs.Problems;
using MyTown.Application.DTOs.Event;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Infrastructure.Hubs;
using System.Security.Claims;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly IHubContext<NotificationHub> _hub;

        public EventsController(IEventService eventService, IHubContext<NotificationHub> hub)
        {
            _eventService = eventService;
            _hub = hub;
        }

        [HttpPost]
        [Authorize(Policy = "CanCreateEvent")]
        public async Task<IActionResult> Create([FromForm] CreateEventDto dto)
        {
            try
            {
                Console.WriteLine("=== CREATE EVENT DEBUG ===");
                Console.WriteLine($"User authenticated: {User.Identity?.IsAuthenticated}");
                Console.WriteLine($"UserId: {User.FindFirst(ClaimTypes.NameIdentifier)?.Value}");
                Console.WriteLine($"StaffId: {User.FindFirst("StaffId")?.Value}");
                foreach (var claim in User.Claims)
                    Console.WriteLine($"Claim: {claim.Type} = {claim.Value}");
                Console.WriteLine("==========================");

                Console.WriteLine($"Files nga Request.Form.Files: {Request.Form.Files.Count}");
                Console.WriteLine($"Files nga dto: {dto.Files?.Count ?? 0}");

                var userId = GetUserId();
                if (!userId.HasValue) return Unauthorized();

                var staffId = GetStaffId();
                if (!staffId.HasValue) return Unauthorized();

                var result = await _eventService.CreateEventAsync(dto, staffId.Value, userId.Value, GetIpAddress());

                await _hub.Clients
          .Group("Citizens")
          .SendAsync("ReceiveNotification", new
          {
              message = $"Event i ri u publikua: {result.Title}",
          });

                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        [HttpGet]
        [Authorize(Policy = "CanViewEvent")]
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
        [Authorize(Policy = "CanViewEvent")]
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
        

        [HttpPut("{id}")]
        [Authorize(Policy = "CanEditEvent")]
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
        [Authorize(Policy = "CanDeleteEvent")]
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