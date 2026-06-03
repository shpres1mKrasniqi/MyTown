

using Microsoft.EntityFrameworkCore;
using MyTown.Application.DTOs.AdvancedSearch;
using MyTown.Application.DTOs.StaffProfiles;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;

namespace MyTown.Application.Services
{
    public class AdvancedStaffSearch : IAdvancedStaffSearch
    {
    
        private readonly IStaffRepository _staffRepository;

        public AdvancedStaffSearch(IStaffRepository staffRepository)
        {
       
            _staffRepository = staffRepository;
        }

        public async Task<PaginationResponse<StaffResponseDto>> SearchStaffAsync(StaffSearch query)
        {

            var pageNumber = query.PageNumber <= 0 ? 1 : query.PageNumber;
            var pageSize = query.PageSize <= 0 || query.PageSize > 50 ? 10 : query.PageSize;

            var stafi =  _staffRepository.Query();

            if (!string.IsNullOrWhiteSpace(query.Position))
            {
                stafi = stafi.Where(s => s.Position.Contains(query.Position));
            }

            if(!string.IsNullOrEmpty(query.FirstName))
            {
                stafi = stafi.Where(s => s.User.FirstName.Contains(query.FirstName));
            }

            if (!string.IsNullOrWhiteSpace(query.LastName))
            {
                stafi = stafi.Where(s => s.User.LastName.Contains(query.LastName));
            }

            if (query.DepartmentId.HasValue)
            {
                stafi = stafi.Where(s => s.DepartmentId == query.DepartmentId);
            }

            if(!string.IsNullOrWhiteSpace(query.Email))
            {
                stafi = stafi.Where(s => s.User.Email.Contains(query.Email));
            }

            var totalCount = await stafi.CountAsync();

            stafi = query.SortBy?.ToLower() switch
            {
                "date" => query.SortDescending
                    ? stafi.OrderByDescending(d => d.CreatedAt)
                    : stafi.OrderBy(d => d.CreatedAt),


                "firstname" => query.SortDescending
                    ? stafi.OrderByDescending(s => s.User.FirstName)
                    : stafi.OrderBy(s => s.User.FirstName),

                "lastname" => query.SortDescending
                    ? stafi.OrderByDescending(s => s.User.LastName)
                    : stafi.OrderBy(s => s.User.LastName),

                "email" => query.SortDescending
                    ? stafi.OrderByDescending(s => s.User.Email)
                    : stafi.OrderBy(s => s.User.Email),

                "departmentId" => query.SortDescending
                    ? stafi.OrderByDescending(s => s.DepartmentId)
                    : stafi.OrderBy(s => s.DepartmentId),

                _ => stafi.OrderByDescending(s => s.CreatedAt)
            };

            var results = await stafi
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new StaffResponseDto
                {
                    Id = s.Id,
                    FirstName = s.User.FirstName,
                    LastName = s.User.LastName,
                    Email = s.User.Email,
                    DepartmentName = s.Department.Name,
                    Position = s.Position,
                    DateHired = s.DateHired
                })
                .ToListAsync();

            return new PaginationResponse<StaffResponseDto>
            {
                TotalCount = totalCount,
                Items = results,
                PageNumber = pageNumber
            };
        }
    }
}
