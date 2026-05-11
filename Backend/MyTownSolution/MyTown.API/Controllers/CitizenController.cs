using Microsoft.AspNetCore.Mvc;
using MyTown.Application.DTOs.Citizens;
using MyTown.Application.Ports.InboundPorts;
using System.Security.Claims;

namespace MyTown.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
 
    public class CitizenController : ControllerBase
    {
        private readonly ICitizenService _citizenService;

        public CitizenController(ICitizenService citizenService)
        {
            _citizenService = citizenService;
        }

        
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> CreateCitizen([FromBody] CreateCitizenDto dto)
        {
            //var adminId = GetAdminId();
            //if (adminId == null) return Unauthorized();

            //string ipAddress = GetIpAddress();

            try
            {
                var response = await _citizenService.CreateCitizenAsync(dto);

                return Ok(new
                {
                    message = "Qytetari u krijua me sukses",
                    data = response
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

      
        [HttpGet]
        //[Authorize(Policy = Permissions.CanViewCitizen)]
        public async Task<IActionResult> GetAllCitizens()
        {
            var citizens = await _citizenService.GetAllCitizensAsync();

            return Ok(citizens);
        }

     
        [HttpGet("{id}")]
        //[Authorize(Policy = Permissions.CanViewCitizen)]
        public async Task<IActionResult> GetCitizenById(int id)
        {
            try
            {
                var citizen = await _citizenService.GetCitizenByIdAsync(id);

                return Ok(citizen);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

    
        [HttpPut("{id}")]
        //[Authorize(Policy = Permissions.CanEditCitizen)]
        public async Task<IActionResult> UpdateCitizen(int id, [FromBody] UpdateCitizenDto dto)
        {
            //var adminId = GetAdminId();
            //if (adminId == null) return Unauthorized();

            //string ipAddress = GetIpAddress();

            try
            {
                var response = await _citizenService.UpdateCitizenAsync(id, dto);

                return Ok(new
                {
                    message = "Qytetari u përditësua me sukses",
                    data = response
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpDelete("{id}")]
        //[Authorize(Policy = Permissions.CanDeleteCitizen)]
        public async Task<IActionResult> DeleteCitizen(int id)
        {
            try
            {
                await _citizenService.DeleteCitizenAsync(id);

                return Ok(new { message = "Qytetari u fshi me sukses" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        //per me ba clean coding dhe me mos e perserit kodin per me marr adminId dhe ipAddress ne secilin endpoint, i kam vendos ne metoda private
        //private int? GetAdminId()
        //{
        //    var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //    if (string.IsNullOrEmpty(claim)) return null;

        //    return int.Parse(claim);
        //}

        //private string GetIpAddress()
        //{
        //    return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";
        //}
    }
}