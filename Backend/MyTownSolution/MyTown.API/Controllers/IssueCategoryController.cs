using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.Authorization;
using MyTown.Application.DTOs.Issues;
using MyTown.Application.Ports.InboundPorts;
using System.Security.Claims;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IssueCategoryController : ControllerBase
    {
        private readonly IIssueCategoryService _issueCategoryService;

        public IssueCategoryController(IIssueCategoryService issueCategoryService)
        {
            _issueCategoryService = issueCategoryService;
        }

     
        [HttpPost]
        [Authorize(Policy = Permissions.CanCreateIssueCategory)]
        public async Task<IActionResult> CreateIssueCategory([FromBody] CreateIssueCategoryDto dto)
        {
            var adminId = GetAdminId();
            if (adminId == null)
                return Unauthorized("Admin ID mungon.");

            var ipAddress = GetIpAddress();

            var result = await _issueCategoryService
                .AddIssueCategoryAsync(dto, adminId.Value, ipAddress);

            return Ok(result);
        }


        [HttpGet]
        //[Authorize(Policy = Permissions.CanViewIssueCategory)] Komentuar me qellim qe me lexu Citizens
        public async Task<IActionResult> GetAll()
        {
            var result = await _issueCategoryService.GetAllAsync();
            return Ok(result);
        }


        [HttpGet("{id}")]
        //[Authorize(Policy = Permissions.CanViewIssueCategory)]  
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _issueCategoryService.GetByIdAsync(id);

            if (result == null)
                return NotFound("Kategoria nuk u gjet.");

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateIssueCategoryDto dto)
        {
            var adminId = GetAdminId();
            if (adminId == null)
                return Unauthorized("Admin ID mungon.");

            var ipAddress = GetIpAddress();

            await _issueCategoryService.UpdateIssueCategoryAsync(
                id,
                dto,
                adminId.Value,
                ipAddress
            );

            return Ok("Kategoria u perditsu me sukses.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIssueCategory(int id)
        {
            var adminId = GetAdminId();
            if (adminId == null)
                return Unauthorized("Admin ID mungon.");

            var ipAddress = GetIpAddress();

            await _issueCategoryService.DeleteAsync(id, adminId.Value, ipAddress);

            return Ok(new { message = "Kategoria u fshi me sukses." });
        }

        private int? GetAdminId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(claim))
                return null;

            if (int.TryParse(claim, out int userId))
                return userId;

            return null;
        }

        private string GetIpAddress()
        {
            return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "E pa njohur";
        }
    }
}