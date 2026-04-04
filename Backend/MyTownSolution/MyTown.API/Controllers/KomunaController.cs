using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        private readonly IPermissionService _permissionService;

        public KomunaController(IKomunaService komunaService, IPermissionService permissionService)
        {
            _komunaService = komunaService;
            _permissionService = permissionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!await _permissionService.UserHasPermission(User, "CanViewKomunas"))
            {
                return Forbid();
            }

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
            if (!await _permissionService.UserHasPermission(User, "CanViewKomunas"))
            {
                return Forbid();
            }

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
        public async Task<IActionResult> Create([FromBody] CreateKomuna dto)
        {
            if (!await _permissionService.UserHasPermission(User, "CanCreateKomuna"))
            {
                return Forbid();
            }

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
        public async Task<IActionResult> Update(int id, [FromBody] UpdateKomuna dto)
        {
            if (!await _permissionService.UserHasPermission(User, "CanUpdateKomuna"))
            {
                return Forbid();
            }

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
        public async Task<IActionResult> Delete(int id)
        {
            if (!await _permissionService.UserHasPermission(User, "CanDeleteKomuna"))
            {
                return Forbid();
            }

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
