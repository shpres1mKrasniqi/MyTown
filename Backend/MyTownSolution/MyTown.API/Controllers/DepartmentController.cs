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
      

        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
         
        }
        [HttpGet]
        [Authorize(Roles ="Admin")]
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
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanCreateDepartment)]
        public async Task<IActionResult> Create(CreateDepartment dto)
        { 
            var userIdClaim = User.Claims.FirstOrDefault(c =>
            c.Type == ClaimTypes.NameIdentifier ||
            c.Type == "id" ||
            c.Type == "sub"
            )?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("User ID not found");
            }

            try
            {
                
                await _departmentService.CreateAsync(dto, userId);
                return StatusCode(201, new { message = "Departmenti u krijua me sukses" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanUpdateDepartment)]
        public async Task<IActionResult> Update(int id, UpdateDepartment dto)
        {

            var userIdClaim = User.Claims.FirstOrDefault(c =>
           c.Type == ClaimTypes.NameIdentifier ||
           c.Type == "id" ||
           c.Type == "sub"
           )?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("User ID not found");
            }

            try
            {
                await _departmentService.UpdateAsync(id, dto, userId);
                return Ok(new { message = "Departmenti u perditesua me sukses" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Policy = Permissions.CanDeleteDepartment)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _departmentService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

