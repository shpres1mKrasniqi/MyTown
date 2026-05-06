using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.Authorization;
using MyTown.Application.DTOs.Komuna;
using MyTown.Application.Ports.InboundPorts;
using System.Security.Claims;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class KomunaController : ControllerBase
    {
        private readonly IKomunaService _komunaService;


        public KomunaController(IKomunaService komunaService)
        {
            _komunaService = komunaService;
           
        }

        [HttpGet]
       
        public async Task<IActionResult> GetAll()
        {
            

            try
            {
                var list = await _komunaService.GetAllAsync();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            

            try
            {
                var item = await _komunaService.GetByIdAsync(id);
                return Ok(item);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Policy = Permissions.CanCreateKomuna)]
        public async Task<IActionResult> Create([FromBody] CreateKomuna dto)
        {
            var adminId = GetAdminId();
            if (adminId == null) return Unauthorized();

            string ipAddress = GetIpAddress();


            try
            {
                await _komunaService.CreateAsync(dto, adminId.Value, ipAddress);
                return StatusCode(201, new { message = "Komuna u krijua me sukses" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        [Authorize(Policy = Permissions.CanEditKomuna)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateKomuna dto)
        {
            var adminId = GetAdminId();
            if (adminId == null) return Unauthorized();

            string ipAddress = GetIpAddress();

            try
            {
                await _komunaService.UpdateAsync(id, dto, adminId.Value, ipAddress);
                return Ok(new { message = "Komuna u perditesua me sukses" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        [Authorize(Policy = Permissions.CanDeleteKomuna)]
        public async Task<IActionResult> Delete(int id)
        {
            var adminId = GetAdminId();
            if (adminId == null) return Unauthorized();

            string ipAddress = GetIpAddress();

            try
            {
                await _komunaService.DeleteAsync(id, adminId.Value, ipAddress);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        private int? GetAdminId()
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

