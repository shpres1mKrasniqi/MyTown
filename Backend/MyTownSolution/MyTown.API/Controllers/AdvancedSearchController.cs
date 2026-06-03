using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyTown.Application.DTOs.AdvancedSearch;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Services;

namespace MyTown.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvancedSearchController : ControllerBase
    {
        private readonly IAdvancedSearchService _advancedSearchService;
        private readonly IAdvancedStaffSearch _advancedStaffSearch;
        private readonly IAdvancedMeetingRequestSearch _advancedMeetingRequestSearch;

        public AdvancedSearchController(IAdvancedSearchService advancedSearchService, IAdvancedStaffSearch advancedStaffSearch, IAdvancedMeetingRequestSearch meetingRequestSearch)
        {
            _advancedSearchService = advancedSearchService;
            _advancedStaffSearch = advancedStaffSearch;
            _advancedMeetingRequestSearch = meetingRequestSearch;
        }

        [HttpGet("issues")]

        public async Task<IActionResult> SearchIssues([FromQuery] IssueSearch search)
        {
            var result = await _advancedSearchService.SearchIssuesAsync(search);

            return Ok(result);
        }

        [HttpGet("departments")]

        public async Task<IActionResult> SearchDepartments([FromQuery] DepartmentSearch search)
        {
            var result = await _advancedSearchService.SearchDepartmentsAsync(search);
            return Ok(result);
        }

        [HttpGet("citizens")]

        public async Task<IActionResult> SearchCitizens([FromQuery] CitizenSearch search)
        {
            var result = await _advancedSearchService.SearchCitizensAsync(search);
            return Ok(result);

        }

        [HttpGet("staff")]

        public async Task<IActionResult> SearchStaff([FromQuery] StaffSearch search)
        {
            var result = await _advancedStaffSearch.SearchStaffAsync(search);
            return Ok(result);

        }

        [HttpGet("meetingRequests")]

        public async Task<IActionResult> SearchMeetingRequests([FromQuery] MeetingRequestSearchDto search)
        {
            var result = await _advancedMeetingRequestSearch.SearchMeetingRequestsAsync(search);
            return Ok(result);
        }
    }
}

