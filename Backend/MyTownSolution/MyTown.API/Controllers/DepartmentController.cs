using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.Authorization;
using MyTown.Application.DTOs.Department;
using MyTown.Application.Ports.InboundPorts;
using System.Security.Claims;


namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;


        public DepartmentController(IDepartmentService departmentService) { 
            _departmentService = departmentService;
            
        }
        [HttpGet]
        [Authorize(Policy = Permissions.CanViewDepartments)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var departments = await _departmentService.GetAllAsync();
                return Ok(departments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Policy = Permissions.CanViewDepartments)]
        public async Task<IActionResult> GetById(int id)
        {

            try
            {
                var dep = await _departmentService.GetByIdAsync(id);
                return Ok(dep);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpPost]
        [Authorize(Policy = Permissions.CanCreateDepartment)]
        public async Task<IActionResult> Create(CreateDepartment dto)
        { 
            var adminId = GetAdminId();
            if (adminId == null) return Unauthorized();

            string ipAddress = GetIpAddress();

            try
            {
                
                await _departmentService.CreateAsync(dto, adminId.Value,  ipAddress);
                return StatusCode(201, new { message = "Departmenti u krijua me sukses" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = Permissions.CanUpdateDepartment)]
        public async Task<IActionResult> Update(int id, UpdateDepartment dto)
        {

            var adminId = GetAdminId();
            if (adminId == null) return Unauthorized();

            string ipAddress = GetIpAddress();

            try
            {
                await _departmentService.UpdateAsync(id, dto, adminId.Value, ipAddress);
                return Ok(new { message = "Departmenti u perditesua me sukses" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Permissions.CanDeleteDepartment)]
        public async Task<IActionResult> Delete(int id )
        {
            var adminId = GetAdminId();
            if (adminId == null) return Unauthorized();
            string ipAddress = GetIpAddress();

            try
            {
                await _departmentService.DeleteAsync(id, adminId.Value, ipAddress);
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


