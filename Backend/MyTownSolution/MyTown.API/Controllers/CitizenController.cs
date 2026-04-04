using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.Authorization;
using MyTown.Application.DTOs.Citizens;
using MyTown.Application.Ports.InboundPorts;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CitizenController : ControllerBase
{
    private readonly ICitizenService _citizenService;

    public CitizenController(ICitizenService citizenService)
    {
        _citizenService = citizenService;
    }

    [HttpPost("AddCitizenProfile")]
    [Authorize(Roles = "Admin")]
    [Authorize(Policy = Permissions.CanCreateCitizen)]
    public async Task<IActionResult> CreateCitizen([FromBody] CreateCitizenDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";

        var response = await _citizenService.CreateCitizenAsync(dto, adminId, ipAddress);
        return Ok(new { message = "Qytetari u krijua me sukses", data = response });
    }

    [HttpGet("GetCitizenProfiles")]
    [Authorize(Roles = "Admin")]
    [Authorize(Policy = Permissions.CanViewCitizen)]
    public async Task<IActionResult> GetAllCitizens()
    {
        var response = await _citizenService.GetAllCitizensAsync();
        return Ok(response);
    }

    [HttpPut("{id}/UpdateCitizenProfile")]
    [Authorize(Roles = "Admin")]
    [Authorize(Policy = Permissions.CanUpdateCitizen)]
    public async Task<IActionResult> UpdateCitizen(int id, [FromBody] UpdateCitizenDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";

        var response = await _citizenService.UpdateCitizenAsync(dto, id, adminId, ipAddress);
        return Ok(new { message = "Profili i qytetarit u perditesua", data = response });
    }

    [HttpDelete("{id}/DeleteCitizenProfile")]
    [Authorize(Roles = "Admin")]
    [Authorize(Policy = Permissions.CanDeleteCitizen)]
    public async Task<IActionResult> DeleteCitizen(int id)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "I panjohur";

        await _citizenService.DeleteCitizenAsync(id, adminId, ipAddress);
        return Ok(new { message = "Qytetari u fshi me sukses" });
    }
}