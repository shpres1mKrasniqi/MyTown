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
    [Authorize]
    public class KomunaController : ControllerBase
    {
        private readonly IKomunaService _komunaService;
       
        public KomunaController(IKomunaService komunaService)
        {
            _komunaService = komunaService;
           
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanViewKomuna)]
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
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanCreateKomuna)]
        public async Task<IActionResult> Create([FromBody] CreateKomuna dto)
        {
           
            var userIdClaim = User.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.NameIdentifier ||
                c.Type == "id" ||
                c.Type == "sub")?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("User ID not found");
            }

            try
            {
                await _komunaService.CreateAsync(dto, userId);
                return StatusCode(201, new { message = "Komuna u krijua me sukses" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanUpdateKomuna)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateKomuna dto)
        {
           

            var userIdClaim = User.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.NameIdentifier ||
                c.Type == "id" ||
                c.Type == "sub")?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("User ID not found");
            }

            try
            {
                await _komunaService.UpdateAsync(id, dto, userId);
                return Ok(new { message = "Komuna u perditesua me sukses" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanDeleteKomuna)]
        public async Task<IActionResult> Delete(int id)
        {

            var userIdClaim = User.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.NameIdentifier ||
                c.Type == "id" ||
                c.Type == "sub")?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("User ID not found");
            }

            try
            {
                await _komunaService.DeleteAsync(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
